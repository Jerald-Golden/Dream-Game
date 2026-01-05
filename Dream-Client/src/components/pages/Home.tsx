import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLobby } from "../../contexts/LobbyContext";
import { Settings } from "lucide-react";
import useCallBackOnEscape from "src/utils/hooks/useCallBackOnEscape";

type NavItem = {
    name: string;
    path: string;
    active: boolean;
    disabled: boolean;
};

function Home() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { createLobby } = useLobby();
    const [isCreatingLobby, setIsCreatingLobby] = useState(false);
    const [lobbyName, setLobbyName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(1);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");

    useCallBackOnEscape(() => {
        setIsCreatingLobby(false);
    }, isCreatingLobby);

    useCallBackOnEscape(() => {
        navigate("/settings");
    }, !isCreatingLobby);

    const navItems: NavItem[] = [
        { name: "NEW GAME", path: "/world", active: true, disabled: false },
        { name: "JOIN GAME", path: "/lobbies", active: false, disabled: false },
        { name: "BATTLEPASS", path: "/battlepass", active: false, disabled: true },
        { name: "COLLECTION", path: "/collection", active: false, disabled: true },
        { name: "SETTINGS", path: "/settings", active: false, disabled: false },
        { name: "SIGN OUT", path: "/logout", active: true, disabled: false },
    ];

    const handleNavClick = async (item: NavItem) => {
        if (!item.disabled) {
            if (item.name === "SIGN OUT") {
                try {
                    await signOut();
                    navigate("/login");
                    localStorage.removeItem("userData");
                } catch (error) {
                    console.error("Error signing out:", error);
                }
                return;
            } else if (item.name === "NEW GAME") {
                setIsCreatingLobby(true);
            } else {
                navigate(item.path);
            }
        }
    };

    const handleCreateLobby = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (user && lobbyName.trim()) {
            createLobby(lobbyName.trim(), user.user_metadata?.full_name || "", user.id, maxPlayers, isPrivate, password);
        }
    };

    return (
        <div className="game-interface">
            <div className="fullscreen-background">{/* <img src="" alt="Agent" className="fullscreen-agent-image" /> */}</div>

            <header className="header">
                <div className="header-left">
                    <div className="logo">
                        <div className="logo-icon"></div>
                        <div className="logo-text">
                            <div className="logo-title">DREAMGAME</div>
                            <div className="logo-version">VERSION 1.0.1</div>
                        </div>
                    </div>
                </div>
                <div className="header-right">
                    <Settings
                        onClick={() => {
                            navigate("/settings");
                        }}
                        className="settings-icon"
                    />
                </div>
            </header>

            <div className="main-content">
                <nav className="sidebar">
                    <ul className="nav-menu">
                        {navItems.map((item, index) => (
                            <li key={index} className={`nav-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} onClick={() => handleNavClick(item)}>
                                <span className="nav-diamond">◆</span>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {isCreatingLobby && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2>Create New Lobby</h2>

                        <label>
                            Lobby Name:
                            <input type="text" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} placeholder="Enter a lobby name" />
                        </label>

                        <label>
                            Max Players: {maxPlayers}
                            <input type="range" min="1" max="10" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))} />
                        </label>

                        <div className="checkbox-container">
                            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} id="private-lobby" />
                            <label htmlFor="private-lobby">Private Lobby</label>
                        </div>

                        {isPrivate && (
                            <label>
                                Password:
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                            </label>
                        )}

                        <div className="overlay-buttons">
                            <button className="overlay-button-create" onClick={handleCreateLobby}>
                                Create & Join
                            </button>
                            <button className="overlay-button-cancel" onClick={() => setIsCreatingLobby(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
