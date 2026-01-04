import { v4 as uuidv4 } from "uuid";

interface RoomPlayer {
    userId: string;
    username: string;
    role: "admin" | "player" | "moderator";
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    state?: string;
    socketId?: string;
}

interface Room {
    roomId: string;
    players: Map<string, RoomPlayer>; // userId -> player
    maxPlayers: number;
    gameId: string;
}

const rooms = new Map<string, Room>(); // roomName -> Room

export function createRoom(name: string, maxPlayers: number, gameId: string) {
    if (!rooms.has(name)) {
        rooms.set(name, {
            roomId: uuidv4(),
            players: new Map(),
            maxPlayers,
            gameId,
        });
    }
}

export function getRooms() {
    const summary: any[] = [];
    for (const [name, room] of rooms) {
        summary.push({
            name,
            roomId: room.roomId,
            maxPlayers: room.maxPlayers,
            currentPlayers: room.players.size,
        });
    }
    return summary;
}

export function getRoom(roomName: string) {
    const room = rooms.get(roomName);
    if (!room) return null;

    return {
        name: roomName,
        roomId: room.roomId,
        maxPlayers: room.maxPlayers,
        currentPlayers: room.players.size,
        players: [...room.players.values()].map((p) => ({
            userId: p.userId,
            username: p.username,
            role: p.role,
        })),
    };
}

export function getRoomPlayers() {
    const players: any[] = [];
    for (const [roomName, room] of rooms) {
        for (const [, player] of room.players) {
            players.push({ ...player, room: roomName });
        }
    }
    return players;
}

export { rooms };
