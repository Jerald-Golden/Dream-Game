import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";
import { Lobby, Room, LobbyPlayer, RoomPlayer } from "../types/socketTypes";

interface SocketContextType {
    lobbies: Lobby[];
    rooms: Room[];
    loading: boolean;
    getLobbies: () => void;
    getLobbyPlayers: (lobbyName: string) => void;
    getRooms: () => void;
    getRoomPlayers: (roomName: string) => void;
}

const SocketContext = createContext<SocketContextType>({
    lobbies: [],
    rooms: [],
    loading: true,
    getLobbies: () => { },
    getLobbyPlayers: () => { },
    getRooms: () => { },
    getRoomPlayers: () => { },
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { session } = useAuth();
    // Determine Socket URL. If VITE_DREAMSERVER_URL is not set (because of restricted env access), fallback to localhost
    const socketUrl = `${import.meta.env.VITE_DREAMSERVER_URL}/api`;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.access_token) return;

        const socket: Socket = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            auth: {
                token: session.access_token,
            },
        });

        setSocket(socket);

        // Lobby list
        const handleLobbiesList = (list: Lobby[]) => {
            setLobbies((prev) =>
                list.map((l) => {
                    const existing = prev.find((p) => p.name === l.name);
                    return { ...l, players: existing?.players || [] };
                })
            );
        };

        // Lobby players
        const handleLobbyPlayersList = ({ lobbyName, players }: { lobbyName: string; players: LobbyPlayer[] }) => {
            setLobbies((prev) => prev.map((l) => (l.name === lobbyName ? { ...l, players } : l)));
        };

        // Room list
        const handleRoomsList = (list: Room[]) => {
            setRooms((prev) =>
                list.map((r) => {
                    const existing = prev.find((p) => p.name === r.name);
                    return { ...r, players: existing?.players || [] };
                })
            );
        };

        // Room players
        const handleRoomPlayersList = ({ roomName, players }: { roomName: string; players: RoomPlayer[] }) => {
            setRooms((prev) => prev.map((r) => (r.name === roomName ? { ...r, players } : r)));
        };

        // Register listeners
        socket.on("lobbiesList", handleLobbiesList);
        socket.on("lobbyPlayersList", handleLobbyPlayersList);
        socket.on("roomsList", handleRoomsList);
        socket.on("roomPlayersList", handleRoomPlayersList);

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            setLoading(false);
            socket.emit("getLobbies");
            socket.emit("getRooms");
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            setLoading(true);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
            setLoading(true);
        });

        // Cleanup on unmount
        return () => {
            socket.off("lobbiesList", handleLobbiesList);
            socket.off("lobbyPlayersList", handleLobbyPlayersList);
            socket.off("roomsList", handleRoomsList);
            socket.off("roomPlayersList", handleRoomPlayersList);
            socket.disconnect();
        };
    }, [socketUrl, session?.access_token]);

    // Expose functions to request updates
    const getLobbies = () => socket?.emit("getLobbies");
    const getLobbyPlayers = (lobbyName: string) => socket?.emit("getLobbyPlayers", { lobbyName });
    const getRooms = () => socket?.emit("getRooms");
    const getRoomPlayers = (roomName: string) => socket?.emit("getRoomPlayers", { roomName });

    const value = useMemo(
        () => ({
            lobbies,
            rooms,
            loading,
            getLobbies,
            getLobbyPlayers,
            getRooms,
            getRoomPlayers,
        }),
        [lobbies, rooms, loading, socket?.connected]
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
