import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../../../contexts/AuthContext";

interface PlayerState {
    id: string; // socketId or userId
    userId: string;
    username: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    state: string;
}

interface RoomContextType {
    roomName: string | null;
    players: PlayerState[];
    loading: boolean;
    sendMove: (position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, state: string) => void;
    socket: Socket | null;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
};

export const RoomProvider = ({ children }: { children: ReactNode }) => {
    const socketUrl = `${import.meta.env.VITE_DREAMSERVER_URL}/room`;
    // We expect the URL to be /room/:roomName
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef<Socket | null>(null);

    const [players, setPlayers] = useState<PlayerState[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomName || !user) return;

        const socket: Socket = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket;

        const handleConnect = () => {
            console.log("Room Socket connected:", socket.id);
            socket.emit("joinRoom", {
                roomName,
                userId: user.id,
                username: user.user_metadata?.full_name || "Unknown",
            });
        };

        const handleUpdateRoom = (roomData: any) => {
            // roomData { roomId, players: Map or Array }
            // dreamServer sends object with players array if we modified it?
            // "players: [...room.players.values()]"
            if (roomData && roomData.players) {
                setPlayers(roomData.players.map((p: any) => ({
                    id: p.userId, // using userId as ID to be consistent? Or socketId? dreamServer stores by userId in Map
                    userId: p.userId,
                    username: p.username,
                    position: p.position || { x: 0, y: 0, z: 0 },
                    rotation: p.rotation || { x: 0, y: 0, z: 0 },
                    state: p.state || "idle"
                })));
                setLoading(false);
            }
        };

        const handleDisconnect = () => {
            console.log("Room Socket disconnected");
        };

        socket.on("connect", handleConnect);
        socket.on("updateRoom", handleUpdateRoom);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("updateRoom", handleUpdateRoom);
            socket.off("disconnect", handleDisconnect);
            socket.disconnect();
        };
    }, [socketUrl, roomName, user]);

    const sendMove = (position: { x: number; y: number; z: number }, rotation: { x: number; y: number; z: number }, state: string) => {
        if (socketRef.current && roomName) {
            socketRef.current.emit("input", {
                roomName,
                userId: user?.id,
                position,
                rotation,
                state
            });
        }
    };

    const value = {
        roomName: roomName || null,
        players,
        loading,
        sendMove,
        socket: socketRef.current
    };

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
