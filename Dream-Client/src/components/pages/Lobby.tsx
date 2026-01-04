import React, { useState, useEffect, useRef } from "react";
import { useLobby } from "../../contexts/LobbyContext";
import { useAuth } from "../../contexts/AuthContext";
import { Crown, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBackOnEscape from "src/utils/hooks/useBackOnEscape";
import LobbyChat from "./LobbyChat";

export default function Lobby() {
    const {
        lobbyName,
        players,
        kickPlayer,
        transferAdmin,
        leaveLobby,
        toggleReady,
        inLobby,
        lobbyState,
        role: myRole,
        selectGame,
        loading,
        countdown,
        requestGameCountdown,
        cancelGameCountdown
    } = useLobby();

    const { user } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState<string | null>(null); // userId for menu

    const maxPlayers = lobbyState?.maxPlayers || 0;
    const currentPlayers = players.length;
    const slots = Array.from({ length: maxPlayers });
    const isAdmin = myRole === "admin";

    useBackOnEscape();

    useEffect(() => {
        // Delay redirect to allow LobbyContext to fetch data if needed
        const timer = setTimeout(() => {
            if (!loading && !inLobby && !lobbyName) {
                navigate("/lobbies");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inLobby, lobbyName, navigate, loading]);



    const handleStartGame = () => {
        if (isAdmin && user) {
            if (countdown !== null) {
                cancelGameCountdown(user.id);
            } else {
                requestGameCountdown(user.id);
            }
        }
    };

    const handleLeave = () => {
        if (user) {
            leaveLobby(user.id);
            navigate("/lobbies");
        }
    };

    const handleReady = () => {
        if (user) {
            toggleReady(user.id);
        }
    };

    const allReady = players.every((p) => p.isReady);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="lobby-container">
            {/* Header */}
            <div className="lobby-header">
                <div className="header-left">
                    <button onClick={handleLeave} className="icon-button">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="mode-title">{lobbyName}</div>
                </div>

                {countdown !== null && (
                    <div className="header-timer">
                        {formatTime(countdown)}
                    </div>
                )}

                <div className="header-right">
                    <div className="party-info">
                        <span className="party-status">{lobbyState?.private ? "PRIVATE" : "PUBLIC"}</span>
                        <div className="party-count">
                            {currentPlayers}/{maxPlayers}
                        </div>
                    </div>

                    {/* Game Selection */}
                    <div className="game-selector-container">
                        <span className="party-status">GAME SELECT:</span>
                        {isAdmin ? (
                            <select
                                className="game-selector"
                                value={lobbyState?.selectedGame || "among-us"}
                                onChange={(e) => user && selectGame(user.id, e.target.value)}
                            >
                                <option value="among-us">Among Us</option>
                                <option value="hide-seek">Hide & Seek</option>
                                <option value="sandbox">Sandbox</option>
                            </select>
                        ) : (
                            <span className="party-status" style={{ color: "var(--text-selected)" }}>
                                {lobbyState?.selectedGame === "among-us" ? "Among Us" :
                                    lobbyState?.selectedGame === "hide-seek" ? "Hide & Seek" :
                                        lobbyState?.selectedGame === "sandbox" ? "Sandbox" : "Among Us"}
                            </span>
                        )}
                    </div>

                    {/* Add more header controls if needed */}
                </div>
            </div>

            {/* Main */}
            <div className="lobby-main" onClick={() => setShowMenu(null)}>
                <div className="players-grid">
                    {slots.map((_, index) => {
                        const player = players[index];
                        const isEmpty = !player;
                        const isMe = player?.userId === user?.id;

                        return (
                            <div
                                key={index}
                                className={`player-slot ${isEmpty ? "empty" : "filled"} ${isAdmin && !isEmpty && !isMe ? "admin-clickable" : ""
                                    }`}
                                onClick={(e) => {
                                    if (isAdmin && !isEmpty && !isMe) {
                                        e.stopPropagation();
                                        setShowMenu(showMenu === player.userId ? null : player.userId);
                                    }
                                }}
                            >
                                {isEmpty ? (
                                    <div className="empty-slot-content">
                                        <User size={48} className="empty-slot-icon" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="player-avatar-container">
                                            <div className="player-avatar-bg"></div>
                                            <div className="player-avatar">
                                                <div className="player-initial">{player.username.charAt(0).toUpperCase()}</div>
                                            </div>
                                            {player.role === "admin" && <Crown size={20} className="admin-crown" fill="gold" />}
                                            {player.role !== "admin" && (
                                                <span className={`player-status ${player.isReady ? "ready" : "not-ready"}`}>
                                                    {player.isReady ? "READY" : "NOT READY"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="player-info">
                                            <div className="player-name">{player.username}</div>
                                            <div className="player-user-id">{player.userId}</div>
                                            <div className="player-rank">LEVEL 1</div>
                                        </div>

                                        {/* Admin Menu */}
                                        {showMenu === player.userId && (
                                            <div className="player-menu" style={{ position: "absolute", top: "40px", right: "10px" }}>
                                                <button className="menu-option" onClick={() => transferAdmin(player.userId)}>
                                                    Make Leader
                                                </button>
                                                <button className="menu-option kick" onClick={() => kickPlayer(player.userId)}>
                                                    Kick Player
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="lobby-bottom">
                    {isAdmin ? (
                        <button
                            className={`start-button admin ${countdown !== null ? "cancel" : ""}`}
                            onClick={handleStartGame}
                            disabled={!allReady && countdown === null || currentPlayers < 1} // allow cancel even if not ready if needed, but usually ready state is locked. If countdown is running, button should be cancel.
                        >
                            {countdown !== null ? `CANCEL START (${countdown})` : "START MATCH"}
                        </button>
                    ) : (

                        <div className="player-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <button
                                className={`start-button member ${players.find((p) => p.userId === user?.id)?.isReady ? "unready-btn" : ""}`}
                                onClick={handleReady}
                            >
                                {players.find((p) => p.userId === user?.id)?.isReady ? "UNREADY" : "READY UP"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Ready Status Indicator */}
                <div className="ready-status-indicator">
                    <span className={allReady ? "all-ready" : "not-all-ready"}>
                        {allReady ? "ALL PLAYERS READY" : "WAITING FOR PLAYERS..."}
                    </span>
                </div>
            </div>

            <LobbyChat />
        </div >
    );
}
