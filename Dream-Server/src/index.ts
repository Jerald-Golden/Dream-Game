import "dotenv-flow/config";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {
    lobbies,
    createLobby,
    getLobbies,
    getLobby,
    getLobbyPlayers,
    LobbyPlayer,
} from "./lobbies";
import { rooms, createRoom, getRooms, getRoom, getRoomPlayers } from "./rooms";

const app = express();
const httpServer = createServer(app);

// CORS configuration - supports both development and production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const PORT = process.env.PORT || 2567;

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("DreamServer (Socket.io) is running!");
});

/* =====================
   API Namespace
   ===================== */
io.of("/api").on("connection", (socket: Socket) => {
    // console.log("API Socket connected:", socket.id);

    socket.on("getLobbies", () => {
        socket.emit("lobbiesList", getLobbies());
    });

    socket.on("getRooms", () => {
        socket.emit("roomsList", getRooms());
    });

    socket.on("getLobbyPlayers", ({ lobbyName }: { lobbyName: string }) => {
        socket.emit("lobbyPlayersList", {
            lobbyName,
            players: getLobbyPlayers(lobbyName),
        });
    });

    socket.on("getRoomPlayers", ({ roomName }: { roomName: string }) => {
        // Implement getRoomPlayers if needed per room
    });
});

/* =====================
   Lobby Namespace
   ===================== */
io.of("/lobby").on("connection", (socket: Socket) => {
    console.log("Lobby Socket connected:", socket.id);

    // Reconnection logic
    socket.on(
        "reconnectToLobby",
        ({ lobbyName, userId }: { lobbyName: string; userId: string }) => {
            const lobby = lobbies.get(lobbyName);
            if (lobby) {
                const player = lobby.players.get(userId);
                if (player) {
                    // Update socket ID on reconnect
                    player.socketId = socket.id;
                    socket.join(lobbyName);
                    socket.emit("reconnected", {
                        lobbyName,
                        username: player.username,
                        role: player.role,
                        isReady: player.isReady,
                    });
                    socket.emit("lobbyUpdated", getLobby(lobbyName));
                    // Note: Don't broadcast 'joined' again, maybe just 'updatePlayers'
                    io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
                } else {
                    socket.emit("reconnected_error", { message: "Player not found in lobby" });
                }
            } else {
                socket.emit("reconnected_error", { message: "Lobby not found" });
            }
        },
    );

    socket.on(
        "createLobby",
        ({ lobbyName, username, userId, maxPlayers, private: isPrivate, password }) => {
            if (lobbies.has(lobbyName)) {
                // Check if user is already in it? Or just error.
                // For simplicity, error if exists.
                // But if reconnecting, use reconnectToLobby.
                // Assuming simplified flow.
            }
            createLobby(lobbyName, username, userId, maxPlayers, isPrivate, password);
            const lobby = lobbies.get(lobbyName)!;

            lobby.players.set(userId, {
                username,
                userId,
                socketId: socket.id,
                role: "admin",
                isReady: true, // admin is always ready?
            });

            socket.join(lobbyName);
            socket.emit("joined", { lobbyName });

            // Broadcast update to API namespace
            io.of("/api").emit("lobbiesList", getLobbies());

            // Emit update to lobby members
            io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));
        },
    );

    socket.on("joinLobby", ({ lobbyName, username, userId, password }) => {
        const lobby = lobbies.get(lobbyName);
        if (!lobby) {
            // handle error
            return;
        }

        if (lobby.private && lobby.password !== password) {
            // handle invalid password
            return;
        }

        if (lobby.players.size >= lobby.maxPlayers) {
            // handle full
            return;
        }

        if (!lobby.players.has(userId)) {
            lobby.players.set(userId, {
                username,
                userId,
                socketId: socket.id,
                role: "player",
                isReady: false,
            });
        } else {
            // Update socket id if rejoining
            const p = lobby.players.get(userId)!;
            p.socketId = socket.id;
        }

        socket.join(lobbyName);
        socket.emit("joined", { lobbyName });

        io.of("/api").emit("lobbiesList", getLobbies());
        io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
        io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));

        if (lobby.launchTimer) {
            clearInterval(lobby.launchTimer);
            lobby.launchTimer = null;
            io.of("/lobby").to(lobbyName).emit("gameCountdownCancelled");
        }

        if (lobby.players.size >= lobby.maxPlayers) {
            // handle full
            return;
        }

        if (!lobby.players.has(userId)) {
            lobby.players.set(userId, {
                username,
                userId,
                socketId: socket.id,
                role: "player",
                isReady: false,
            });
        } else {
            // Update socket id if rejoining
            const p = lobby.players.get(userId)!;
            p.socketId = socket.id;
        }

        socket.join(lobbyName);
        socket.emit("joined", { lobbyName });

        io.of("/api").emit("lobbiesList", getLobbies());
        io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
        io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));
    });

    socket.on("chat", ({ lobbyName, message, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby && lobby.players.has(userId)) {
            const player = lobby.players.get(userId)!;
            const chatMsg = { from: player.username, message };
            // lobby.chat.push(chatMsg); // We don't store persistent chat in mock
            io.of("/lobby").to(lobbyName).emit("chat", chatMsg);
        }
    });

    socket.on("leaveLobby", ({ lobbyName, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby) {
            lobby.players.delete(userId);
            socket.leave(lobbyName);

            if (lobby.players.size === 0) {
                lobbies.delete(lobbyName);
                io.of("/api").emit("lobbiesList", getLobbies());
            } else {
                // If admin left, assign new admin?
                // Minimal simple logic:
                if ([...lobby.players.values()].every((p) => p.role !== "admin")) {
                    const nextAdmin = lobby.players.keys().next().value;
                    if (nextAdmin) lobby.players.get(nextAdmin)!.role = "admin";
                }

                io.of("/api").emit("lobbiesList", getLobbies());
                io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
                io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));

                if (lobby.launchTimer) {
                    clearInterval(lobby.launchTimer);
                    lobby.launchTimer = null;
                    io.of("/lobby").to(lobbyName).emit("gameCountdownCancelled");
                }
            }
        }
    });

    socket.on("kickFromLobby", ({ lobbyName, targetUserId, senderUserId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby) {
            const sender = lobby.players.get(senderUserId);
            if (sender?.role === "admin") {
                const target = lobby.players.get(targetUserId);
                if (target) {
                    lobby.players.delete(targetUserId);
                    // Emit kicked to specific socket?
                    // We can emit to room "kicked" with userId, clients check if it's them?
                    // Or io.to(target.socketId).emit("kicked");
                    if (target.socketId)
                        io.of("/lobby")
                            .to(target.socketId)
                            .emit("kicked", "You have been kicked by the host.");

                    io.of("/api").emit("lobbiesList", getLobbies());
                    io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
                    io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));

                    if (lobby.launchTimer) {
                        clearInterval(lobby.launchTimer);
                        lobby.launchTimer = null;
                        io.of("/lobby").to(lobbyName).emit("gameCountdownCancelled");
                    }
                }
            }
        }
    });

    socket.on("toggleReady", ({ lobbyName, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby) {
            const player = lobby.players.get(userId);
            if (player) {
                player.isReady = !player.isReady;
                io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));

                if (lobby.launchTimer) {
                    clearInterval(lobby.launchTimer);
                    lobby.launchTimer = null;
                    io.of("/lobby").to(lobbyName).emit("gameCountdownCancelled");
                }
            }
        }
    });

    socket.on("selectGame", ({ lobbyName, gameId, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby && lobby.players.get(userId)?.role === "admin") {
            lobby.selectedGame = gameId;
            io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));
        }
    });

    socket.on("moveToRoom", ({ lobbyName, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby && lobby.players.get(userId)?.role === "admin") {
            lobby.inRoom = true;
            createRoom(lobbyName, lobby.maxPlayers, lobby.selectedGame);

            // Just broadcast to everyone in lobby to move
            io.of("/lobby").to(lobbyName).emit("movedToRoom", { roomName: lobbyName });

            io.of("/api").emit("lobbiesList", getLobbies());
            io.of("/api").emit("roomsList", getRooms());
        }
    });

    socket.on("requestGameCountdown", ({ lobbyName, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby && lobby.players.get(userId)?.role === "admin") {
            if (lobby.launchTimer) clearInterval(lobby.launchTimer);

            // Start logic
            let seconds = 10;
            io.of("/lobby").to(lobbyName).emit("gameCountdownTick", { seconds });

            lobby.launchTimer = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    clearInterval(lobby.launchTimer);
                    lobby.launchTimer = null;

                    lobby.inRoom = true;
                    createRoom(lobbyName, lobby.maxPlayers, lobby.selectedGame);
                    io.of("/lobby").to(lobbyName).emit("movedToRoom", { roomName: lobbyName });
                    io.of("/api").emit("lobbiesList", getLobbies());
                    io.of("/api").emit("roomsList", getRooms());
                } else {
                    io.of("/lobby").to(lobbyName).emit("gameCountdownTick", { seconds });
                }
            }, 1000);
        }
    });

    socket.on("cancelGameCountdown", ({ lobbyName, userId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby && lobby.players.get(userId)?.role === "admin") {
            if (lobby.launchTimer) {
                clearInterval(lobby.launchTimer);
                lobby.launchTimer = null;
                io.of("/lobby").to(lobbyName).emit("gameCountdownCancelled");
            }
        }
    });

    socket.on("transferAdminRole", ({ lobbyName, targetUserId, senderUserId }) => {
        const lobby = lobbies.get(lobbyName);
        if (lobby) {
            const sender = lobby.players.get(senderUserId);
            if (sender?.role === "admin") {
                const target = lobby.players.get(targetUserId);
                if (target) {
                    sender.role = "player";
                    sender.isReady = false;
                    target.role = "admin";
                    target.isReady = true;

                    io.of("/lobby").to(lobbyName).emit("updatePlayers", getLobbyPlayers(lobbyName));
                    io.of("/lobby").to(lobbyName).emit("lobbyUpdated", getLobby(lobbyName));
                }
            }
        }
    });
});

/* =====================
   Room Namespace
   ===================== */
io.of("/room").on("connection", (socket: Socket) => {
    console.log("Room Socket connected:", socket.id);

    socket.on("joinRoom", ({ roomName, userId, username }) => {
        const room = rooms.get(roomName);
        if (room) {
            socket.join(roomName);
            if (!room.players.has(userId)) {
                room.players.set(userId, {
                    userId,
                    username,
                    role: "player",
                    socketId: socket.id,
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    state: "idle",
                });
            } else {
                const p = room.players.get(userId)!;
                p.socketId = socket.id;
            }

            // Broadcast full room state?
            io.of("/room")
                .to(roomName)
                .emit("updateRoom", {
                    roomId: room.roomId,
                    players: [...room.players.values()],
                });
        }
    });

    socket.on("input", ({ roomName, userId, position, rotation, state }) => {
        const room = rooms.get(roomName);
        if (room) {
            const player = room.players.get(userId);
            if (player) {
                if (position) player.position = position;
                if (rotation) player.rotation = rotation;
                if (state) player.state = state;

                // Broadcast updates
                // Optimization: Don't send whole room? For now, send whole room for simplicity as per original
                io.of("/room")
                    .to(roomName)
                    .emit("updateRoom", {
                        roomId: room.roomId,
                        players: [...room.players.values()],
                    });
            }
        }
    });

    socket.on("chat", ({ roomName, message, userId, username }) => {
        io.of("/room").to(roomName).emit("chat", { sender: username, message });
    });

    socket.on("disconnect", () => {
        // Handle disconnect?
        // In room, maybe keep player for a bit?
        // For now, if socket disconnects we don't necessarily remove player immediately OR we do.
        // Let's iterate rooms to find socket.id
        // (Inefficient but simple)
        for (const [roomName, room] of rooms) {
            let disconnectedUser: string | null = null;
            for (const [userId, player] of room.players) {
                if (player.socketId === socket.id) {
                    disconnectedUser = userId;
                    break;
                }
            }
            if (disconnectedUser) {
                room.players.delete(disconnectedUser);
                io.of("/room")
                    .to(roomName)
                    .emit("updateRoom", {
                        roomId: room.roomId,
                        players: [...room.players.values()],
                    });

                if (room.players.size === 0) {
                    rooms.delete(roomName);
                    // Also cleanup lobby if it still exists and was in room
                    const lobby = lobbies.get(roomName);
                    if (lobby && lobby.inRoom) {
                        lobbies.delete(roomName);
                    }
                    io.of("/api").emit("lobbiesList", getLobbies());
                    io.of("/api").emit("roomsList", getRooms());
                }
            }
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Game-Server listening on port ${PORT}`);
});
