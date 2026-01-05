import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Game from "@features/games/among-us/game/game";
import Preloader from "@components/loading/preLoader";
import UI from "@components/ui/ui";

import UpdateLoader from "@components/loading/UpdateLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SocketLayout from "./components/auth/SocketLayout";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import LobbyDashboard from "./components/pages/LobbyDashBoard";
import Lobby from "./components/pages/Lobby";
import Settings from "./components/pages/Settings";
import NotFound from "./components/pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { RoomProvider } from "src/contexts/RoomContext";

// Wrapper for the actual game
const GameWrapper: React.FC = () => {
    return (
        <>
            <Preloader />
            <UI />
            <Game />
        </>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <UpdateLoader />
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <SocketLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="lobbies" element={<LobbyDashboard />} />
                        <Route path="lobby/:lobbyName" element={<Lobby />} />
                        <Route path="settings" element={<Settings />} />

                        {/* Game Room Route */}
                        <Route
                            path="room/:roomName"
                            element={
                                <RoomProvider>
                                    <GameWrapper />
                                </RoomProvider>
                            }
                        />
                    </Route>


                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
            </AuthProvider>
        </HashRouter>
    );
};

export default App;
