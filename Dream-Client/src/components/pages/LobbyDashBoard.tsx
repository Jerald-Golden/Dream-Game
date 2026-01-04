import { useState, useMemo } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import { Search, User, Users, Lock, Unlock, Monitor, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLobby } from "../../contexts/LobbyContext";
import useBackOnEscape from "src/utils/hooks/useBackOnEscape";

export default function LobbyDashboard() {
    const { lobbies, loading, getLobbies } = useSocket();
    const { joinLobby } = useLobby();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedLobby, setSelectedLobby] = useState<any | null>(null);
    const [password, setPassword] = useState("");
    const [joinError, setJoinError] = useState("");

    useBackOnEscape();

    // Filter lobbies
    const filteredLobbies = useMemo(() => {
        let result = lobbies;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((lobby) => lobby.name.toLowerCase().includes(term) || lobby.username.toLowerCase().includes(term));
        }

        // Tab filter
        if (activeTab === "public") {
            result = result.filter((lobby) => !lobby.private);
        } else if (activeTab === "private") {
            result = result.filter((lobby) => lobby.private);
        }

        return result;
    }, [lobbies, searchTerm, activeTab]);

    const handleJoinClick = (lobby: any) => {
        if (lobby.private) {
            setSelectedLobby(lobby);
            setPassword("");
            setJoinError("");
        } else {
            if (user) {
                joinLobby(lobby.name, user.user_metadata?.full_name || "Unknown", user.id, "");
            }
        }
    };

    const handlePrivateJoin = () => {
        if (selectedLobby && user) {
            // In a real app we might verify password here or let backend do it
            // Backend joinLobby takes password
            if (password) {
                joinLobby(selectedLobby.name, user.user_metadata?.full_name || "Unknown", user.id, password);
                setSelectedLobby(null);
            } else {
                setJoinError("Password required");
            }
        }
    };

    return (
        <div className="lobby-dashboard">
            <div className="lobby-dashboard-container">
                {/* Header */}
                <div className="lobby-dashboard-header">
                    <div className="lobby-dashboard-header-content">
                        <div className="lobby-dashboard-header-info">
                            <h1 className="lobby-dashboard-title">
                                <button className="lobby-dashboard-btn lobby-dashboard-btn-outline lobby-dashboard-btn-sm" onClick={() => navigate("/")} style={{ marginRight: "1rem" }}>
                                    <ArrowLeft size={16} />
                                </button>
                                Game Lobbies
                            </h1>
                            <p className="lobby-dashboard-subtitle">
                                Status: <span className="lobby-dashboard-status-healthy">Online</span>
                            </p>
                        </div>
                        <div className="lobby-dashboard-header-actions">
                            <button className="lobby-dashboard-btn lobby-dashboard-btn-outline" onClick={() => getLobbies()}>
                                Refresh
                            </button>
                            <button className="lobby-dashboard-btn lobby-dashboard-btn-primary" onClick={() => navigate("/")}>
                                Create Lobby
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="lobby-dashboard-filters-card">
                    <div className="lobby-dashboard-filters-grid">
                        <div className="lobby-dashboard-search-container">
                            <Search className="lobby-dashboard-search-icon" />
                            <input
                                type="text"
                                className="lobby-dashboard-input lobby-dashboard-search-input"
                                placeholder="Search lobbies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="lobby-dashboard-select"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            <option value="all">All Lobbies</option>
                            <option value="public">Public Only</option>
                            <option value="private">Private Only</option>
                        </select>
                    </div>
                </div>

                {/* Session List */}
                <div className="lobby-dashboard-session-list-card">
                    <div className="lobby-dashboard-session-list-header">
                        <h2 className="lobby-dashboard-session-list-title">Available Sessions ({filteredLobbies.length})</h2>
                    </div>

                    {/* Table Header */}
                    <div className="lobby-dashboard-table-header">
                        <div className="lobby-dashboard-sno-col">#</div>
                        <div className="lobby-dashboard-session-col">SESSION NAME</div>
                        <div className="lobby-dashboard-players-col">PLAYERS</div>
                        <div className="lobby-dashboard-mode-col">ACCESS</div>
                        <div className="lobby-dashboard-creator-col">CREATOR</div>
                        <div className="lobby-dashboard-action-col">ACTION</div>
                    </div>

                    {/* Rows */}
                    <div className="lobby-dashboard-session-rows">
                        {loading ? (
                            <div className="session-loading-container">
                                <div className="session-spinner"></div>
                                <p className="lsession-oading-text">Loading sessions...</p>
                            </div>
                        ) : filteredLobbies.length === 0 ? (
                            <div className="session-loading-container">
                                <p className="lsession-oading-text">No lobbies found. Create one to start!</p>
                            </div>
                        ) : (
                            filteredLobbies.map((lobby, index) => (
                                <div key={lobby.lobbyId} className="lobby-dashboard-session-row">
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-sno-col">
                                        <span className="lobby-dashboard-serial-number">{index + 1}</span>
                                    </div>
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-session-col">
                                        <span className="lobby-dashboard-session-name">{lobby.name}</span>
                                        {lobby.inRoom && <span className="lobby-dashboard-badge lobby-dashboard-badge-secondary" style={{ marginLeft: "8px" }}>In Game</span>}
                                    </div>
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-players-col">
                                        <div className="lobby-dashboard-players-container">
                                            <Users className="lobby-dashboard-icon-sm" />
                                            <span>
                                                {lobby.currentPlayers}/{lobby.maxPlayers}
                                            </span>
                                            <div className={`lobby-dashboard-status-dot ${lobby.currentPlayers >= lobby.maxPlayers ? "lobby-dashboard-status-full" : "lobby-dashboard-status-online"}`}></div>
                                        </div>
                                    </div>
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-mode-col">
                                        {lobby.private ? (
                                            <span className="lobby-dashboard-badge lobby-dashboard-badge-outline">
                                                <Lock className="lobby-dashboard-icon-sm" /> Private
                                            </span>
                                        ) : (
                                            <span className="lobby-dashboard-badge lobby-dashboard-badge-secondary">
                                                <Unlock className="lobby-dashboard-icon-sm" /> Public
                                            </span>
                                        )}
                                    </div>
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-creator-col">
                                        <div className="lobby-dashboard-creator-container">
                                            <Monitor className="lobby-dashboard-creator-icon" size={16} />
                                            <span className="lobby-dashboard-creator-name">{lobby.username}</span>
                                        </div>
                                    </div>
                                    <div className="lobby-dashboard-table-cell lobby-dashboard-action-col">
                                        <button
                                            className="lobby-dashboard-btn lobby-dashboard-btn-outline lobby-dashboard-btn-sm"
                                            onClick={() => handleJoinClick(lobby)}
                                            disabled={lobby.currentPlayers >= lobby.maxPlayers || lobby.inRoom}
                                        >
                                            {lobby.inRoom ? "Started" : lobby.currentPlayers >= lobby.maxPlayers ? "Full" : "Join"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="lobby-dashboard-footer">
                    <span className="lobby-dashboard-server-count">Total Servers: 1</span>
                    <span className="lobby-dashboard-server-count">Region: US-East</span>
                </div>
            </div>

            {/* Password Dialog */}
            {selectedLobby && (
                <div className="lobby-dashboard-dialog-overlay">
                    <div className="lobby-dashboard-dialog-content">
                        <div className="lobby-dashboard-dialog-header">
                            <h3 className="lobby-dashboard-dialog-title">Join Private Lobby</h3>
                            <button className="lobby-dashboard-close-button" onClick={() => setSelectedLobby(null)}>
                                X
                            </button>
                        </div>
                        <div className="lobby-dashboard-dialog-body">
                            <div className="lobby-dashboard-session-info">
                                <h4 className="lobby-dashboard-session-info-name">{selectedLobby.name}</h4>
                                <p className="lobby-dashboard-session-info-details">by {selectedLobby.username}</p>
                            </div>
                            <div className="lobby-dashboard-password-field">
                                <label className="lobby-dashboard-label">Password</label>
                                <input
                                    type="password"
                                    className="lobby-dashboard-input"
                                    placeholder="Enter lobby password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {joinError && <p style={{ color: "red", fontSize: "0.875rem" }}>{joinError}</p>}
                            </div>
                        </div>
                        <div className="lobby-dashboard-dialog-actions">
                            <button className="lobby-dashboard-btn lobby-dashboard-btn-outline lobby-dashboard-btn-flex" onClick={() => setSelectedLobby(null)}>
                                Cancel
                            </button>
                            <button className="lobby-dashboard-btn lobby-dashboard-btn-primary lobby-dashboard-btn-flex" onClick={handlePrivateJoin}>
                                Join Lobby
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
