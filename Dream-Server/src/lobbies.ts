import { v4 as uuidv4 } from "uuid";

// Types
export interface LobbyPlayer {
    userId: string;
    username: string;
    socketId: string;
    role: "admin" | "player" | "moderator";
    isReady: boolean;
}

export interface Lobby {
    lobbyId: string;
    username: string; // Creator username
    userId: string; // Creator userId
    players: Map<string, LobbyPlayer>; // userId -> player
    maxPlayers: number;
    inRoom: boolean;
    private: boolean;
    password?: string;
    chat: { from: string; message: string }[];
    selectedGame: string;
    launchTimer?: any;
}

const lobbies = new Map<string, Lobby>(); // lobbyName -> Lobby

export function createLobby(
    name: string,
    username: string,
    userId: string,
    maxPlayers: number,
    isPrivate: boolean,
    password?: string,
    selectedGame: string = "among-us",
) {
    if (!lobbies.has(name)) {
        lobbies.set(name, {
            lobbyId: uuidv4(),
            username,
            userId,
            players: new Map(),
            maxPlayers,
            inRoom: false,
            private: isPrivate,
            password: isPrivate ? password : "",
            chat: [],
            selectedGame,
        });
    }
}

export function getLobbies() {
    const summary: any[] = [];
    for (const [name, lobby] of lobbies) {
        summary.push({
            name,
            lobbyId: lobby.lobbyId,
            username: lobby.username,
            userId: lobby.userId,
            currentPlayers: lobby.players.size,
            players: [...lobby.players.values()].map((p) => ({
                userId: p.userId,
                username: p.username,
                role: p.role,
                isReady: p.isReady,
            })),
            maxPlayers: lobby.maxPlayers,
            inRoom: lobby.inRoom,
            private: lobby.private,
        });
    }
    return summary;
}

export function getLobby(lobbyName: string) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return null;

    return {
        name: lobbyName,
        lobbyId: lobby.lobbyId,
        username: lobby.username,
        userId: lobby.userId,
        currentPlayers: lobby.players.size,
        players: [...lobby.players.values()].map((p) => ({
            userId: p.userId,
            username: p.username,
            role: p.role,
            socketId: p.socketId,
            isReady: p.isReady,
        })),
        maxPlayers: lobby.maxPlayers,
        inRoom: lobby.inRoom,
        private: lobby.private,
        selectedGame: lobby.selectedGame,
    };
}

export function getLobbyPlayers(lobbyName: string) {
    const lobby = lobbies.get(lobbyName);
    if (!lobby) return [];
    return [...lobby.players.values()];
}

export { lobbies };
