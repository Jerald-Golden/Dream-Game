export interface LobbyPlayer {
    username: string;
    userId: string;
    role: "admin" | "player" | "moderator";
    isReady: boolean;
}

export interface Lobby {
    name: string;
    lobbyId: string;
    userId: string;
    username: string;
    currentPlayers: number;
    maxPlayers: number;
    inRoom: boolean;
    private: boolean;
    players: LobbyPlayer[];
    chat: [];
    selectedGame: string;
}

export interface RoomPlayer {
    username: string;
    userId: string;
    role: "admin" | "player" | "moderator";
}

export interface Room {
    name: string;
    roomId: string;
    currentPlayers: number;
    maxPlayers: number;
    players: RoomPlayer[];
}
