import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { Lobby, LobbyPlayer } from "../types/socketTypes";

interface LobbyChatMessage {
    from: string;
    message: string;
}

interface LobbyContextType {
    lobbyName: string | null;
    players: LobbyPlayer[];
    chat: LobbyChatMessage[];
    role: string | undefined;
    loading: boolean;
    inLobby: boolean;
    isPrivate: boolean;
    maxPlayers: number;
    currentPlayers: number;
    lobbyState: Lobby | null;
    createLobby: (lobbyName: string, username: string, userId: string, maxPlayers: number, isPrivate: boolean, password: string) => void;
    joinLobby: (lobbyName: string, username: string, userId: string, password: string) => void;
    sendChat: (message: string, userId: string) => void;
    kickPlayer: (targetUserId: string) => void;
    transferAdmin: (targetUserId: string) => void;
    startGame: (userId: string) => void;
    leaveLobby: (userId: string) => void;
    toggleReady: (userId: string) => void;
    resetReadyStates: (userId: string) => void;
    selectGame: (userId: string, gameId: string) => void;
    countdown: number | null;
    requestGameCountdown: (userId: string) => void;
    cancelGameCountdown: (userId: string) => void;
}

const LobbyContext = createContext<LobbyContextType>({
    lobbyName: null,
    players: [],
    chat: [],
    role: undefined,
    loading: true,
    inLobby: false,
    isPrivate: false,
    maxPlayers: 0,
    currentPlayers: 0,
    lobbyState: null,
    createLobby: () => { },
    joinLobby: () => { },
    sendChat: () => { },
    kickPlayer: () => { },
    transferAdmin: () => { },
    startGame: () => { },
    leaveLobby: () => { },
    toggleReady: () => { },
    resetReadyStates: () => { },
    selectGame: () => { },
    countdown: null,
    requestGameCountdown: () => { },
    cancelGameCountdown: () => { },
});

export const LobbyProvider = ({ children }: { children: ReactNode }) => {
    // Determine Socket URL. If VITE_DREAMSERVER_URL is not set, fallback.
    const socketUrl = `${import.meta.env.VITE_DREAMSERVER_URL}/lobby`;
    const navigate = useNavigate();
    const { user, session } = useAuth();
    const { lobbyName: lobbyNameInUrl } = useParams();
    const socketRef = useRef<Socket | null>(null);
    const [lobbyName, setLobbyName] = useState<string | null>(null);
    const [players, setPlayers] = useState<LobbyPlayer[]>([]);
    const [chat, setChat] = useState<LobbyChatMessage[]>([]);
    const [role, setRole] = useState<string | undefined>();
    const [loading, setLoading] = useState(true);
    const [inLobby, setInLobby] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [currentPlayers, setCurrentPlayers] = useState(0);
    const [lobbyState, setLobbyState] = useState<Lobby | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [attemptedReconnect, setAttemptedReconnect] = useState(false);

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

        socketRef.current = socket;
        setLoading(false);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [socketUrl, session?.access_token]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handleJoined = ({ lobbyName }: { lobbyName: string }) => {
            navigate(`/lobby/${lobbyName}`);
            setLobbyName(lobbyName);
            setInLobby(true);

            localStorage.setItem(
                "currentLobby",
                JSON.stringify({
                    name: lobbyName,
                    userId: user?.id,
                    username: user?.user_metadata?.full_name,
                })
            );
        };

        const fetchLobby = () => {
            const savedLobby = localStorage.getItem("currentLobby");
            if (savedLobby && user) {
                const lobbyInfo = JSON.parse(savedLobby);
                if (lobbyInfo.userId === user.id) {
                    socket.emit("reconnectToLobby", {
                        lobbyName: lobbyInfo.name,
                        userId: user.id,
                        username: user?.user_metadata?.full_name,
                    });
                    return;
                }
            }

            if (lobbyNameInUrl && user) {
                // Fetch if we are not marked as in-lobby OR if the name doesn't match
                if (!inLobby || lobbyName !== lobbyNameInUrl) {
                    setLoading(true);
                    socket.emit("getLobby", { lobbyName: lobbyNameInUrl });
                }
            }
        };

        const handleConnect = () => {
            console.log("Lobby Socket connected:", socket.id);

            if (!attemptedReconnect) {
                fetchLobby();
                setAttemptedReconnect(true);
            }

            setLoading(false);
        };

        // If already connected and URL changes, try to fetch
        if (socket.connected && lobbyNameInUrl && !inLobby) {
            fetchLobby();
        }

        const handleReconnected = ({ lobbyName, username, role, isReady }: { lobbyName: string; username: string; role: string; isReady: boolean }) => {
            console.log("Lobby Socket reconnected: ", lobbyName);
            setLobbyName(lobbyName);
            setRole(role);
            setInLobby(true);
            navigate(`/lobby/${lobbyName}`);
            setLoading(false);
        };

        const handleReconnectedError = ({ message }: { message: string }) => {
            localStorage.removeItem("currentLobby");
            setInLobby(false);
            navigate("/not-found", { state: { message: message } });
        };

        const handleDisconnect = () => {
            console.log("Lobby Socket disconnected");
            setLoading(true);
            setInLobby(false);
        };

        const handleConnectError = () => {
            console.error("Lobby Socket connection error");
            setLoading(true);
            setInLobby(false);
        };

        const handleGetLobbyData = (lobbyData: Lobby | null) => {
            if (lobbyData) {
                setLobbyName(lobbyData.name);
                setPlayers(lobbyData.players);
                setIsPrivate(lobbyData.private);
                setMaxPlayers(lobbyData.maxPlayers);
                setCurrentPlayers(lobbyData.currentPlayers);
                setLobbyState(lobbyData);

                const userPlayer = lobbyData.players.find((p) => p.userId === user?.id);
                setRole(userPlayer?.role ?? "player");
                setInLobby(true);
                setLoading(false);
            } else {
                setInLobby(false);
                setLobbyState(null);
            }
        };

        const handleUpdatePlayers = (players: LobbyPlayer[]) => {
            setPlayers(players);
            setCurrentPlayers(players.length);

            const userPlayer = players.find((p) => p.userId === user?.id);
            setRole(userPlayer?.role ?? "player");
            setInLobby(!!userPlayer);

            if (lobbyState) {
                setLobbyState({
                    ...lobbyState,
                    players,
                    currentPlayers: players.length,
                });
            }
        };

        const handleChat = (msg: LobbyChatMessage) => {
            setChat((prev) => [...prev, msg]);
        };

        const handleKicked = (msg: string) => {
            navigate("/not-found", { state: { message: "Oops you been kicked... :(" } });
            setLobbyName(null);
            setPlayers([]);
            setChat([]);
            setInLobby(false);
            setIsPrivate(false);
            setMaxPlayers(0);
            setCurrentPlayers(0);
            setLobbyState(null);
            localStorage.removeItem("currentLobby");
        };

        const handleMovedToRoom = ({ roomName }: { roomName: string }) => {
            localStorage.setItem(
                "currentRoom",
                JSON.stringify({
                    name: roomName,
                    userId: user?.id,
                    username: user?.user_metadata?.full_name,
                })
            );
            localStorage.removeItem("currentLobby");
            setInLobby(false);
            setLobbyState(null);
            navigate(`/room/${roomName}`); // This will go to game room
        };

        socket.on("joined", handleJoined);
        socket.on("connect", handleConnect);
        socket.on("reconnected", handleReconnected);
        socket.on("reconnected_error", handleReconnectedError);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("lobbyUpdated", handleGetLobbyData);
        socket.on("updatePlayers", handleUpdatePlayers);
        socket.on("chat", handleChat);
        socket.on("kicked", handleKicked);
        socket.on("movedToRoom", handleMovedToRoom);

        socket.on("gameCountdownTick", ({ seconds }: { seconds: number }) => {
            setCountdown(seconds);
        });

        socket.on("gameCountdownCancelled", () => {
            setCountdown(null);
        });

        return () => {
            socket.off("joined", handleJoined);
            socket.off("connect", handleConnect);
            socket.off("reconnected", handleReconnected);
            socket.off("reconnected_error", handleReconnectedError);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("lobbyUpdated", handleGetLobbyData);
            socket.off("updatePlayers", handleUpdatePlayers);
            socket.off("chat", handleChat);
            socket.off("kicked", handleKicked);
            socket.off("movedToRoom", handleMovedToRoom);
            socket.off("gameCountdownTick");
            socket.off("gameCountdownCancelled");
        };
    }, [socketUrl, lobbyNameInUrl, user, attemptedReconnect]);

    const createLobby = (lobbyName: string, username: string, userId: string, maxPlayers: number, isPrivate: boolean, password: string) => {
        socketRef.current?.emit("createLobby", { lobbyName, username, userId, maxPlayers, private: isPrivate, password });
    };

    const joinLobby = (lobbyName: string, username: string, userId: string, password: string) => {
        socketRef.current?.emit("joinLobby", { lobbyName, username, userId, password });
    };

    const sendChat = (message: string, userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("chat", { lobbyName, message, userId });
        }
    };

    const kickPlayer = (targetUserId: string) => {
        if (lobbyName && user) {
            socketRef.current?.emit("kickFromLobby", { lobbyName, targetUserId, senderUserId: user.id });
        }
    };

    const transferAdmin = (targetUserId: string) => {
        if (lobbyName && user) {
            socketRef.current?.emit("transferAdminRole", { lobbyName, targetUserId, senderUserId: user.id });
        }
    };

    const startGame = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("moveToRoom", { lobbyName, userId });
        }
    };

    const leaveLobby = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("leaveLobby", { lobbyName, userId });
            setLobbyName(null);
            setPlayers([]);
            setChat([]);
            setInLobby(false);
            setIsPrivate(false);
            setMaxPlayers(0);
            setCurrentPlayers(0);
            setLobbyState(null);
            localStorage.removeItem("currentLobby");
        }
    };

    const toggleReady = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("toggleReady", { lobbyName, userId });
        }
    };

    const resetReadyStates = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("resetReadyStates", { lobbyName, userId });
        }
    };

    const selectGame = (userId: string, gameId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("selectGame", { lobbyName, gameId, userId });
        }
    };

    const requestGameCountdown = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("requestGameCountdown", { lobbyName, userId });
        }
    };

    const cancelGameCountdown = (userId: string) => {
        if (lobbyName) {
            socketRef.current?.emit("cancelGameCountdown", { lobbyName, userId });
        }
    };

    const value = useMemo(
        () => ({
            lobbyName,
            players,
            chat,
            role,
            loading,
            inLobby,
            isPrivate,
            maxPlayers,
            currentPlayers,
            lobbyState,
            createLobby,
            joinLobby,
            sendChat,
            kickPlayer,
            transferAdmin,
            startGame,
            leaveLobby,
            toggleReady,
            resetReadyStates,
            selectGame,
            countdown,
            requestGameCountdown,
            cancelGameCountdown
        }),
        [lobbyName, players, chat, role, loading, inLobby, isPrivate, maxPlayers, currentPlayers, lobbyState, countdown]
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Connecting to server...</p>
            </div>
        );
    }

    return <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>;
};

export const useLobby = () => useContext(LobbyContext);
