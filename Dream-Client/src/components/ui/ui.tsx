import React from "react";
import StaminaBar from "./player/staminaBar";
import CrossHair from "./player/crosssHair";
import { useRoom } from "@features/games/among-us/multiplayer/roomContext";
import { useNavigate } from "react-router-dom";

import { useStamina } from "@core/store/store";
import MiniMap from "./game/miniMap";
import ChatUI from "./game/chatMenu";

const UI: React.FC = () => {
    const { stamina } = useStamina();
    const { roomName } = useRoom();
    const navigate = useNavigate();

    const handleBackToLobby = () => {
        if (roomName) {
            navigate(`/lobby/${roomName}`);
        } else {
            navigate("/lobbies");
        }
    };

    return (
        <>
            <div style={{ zIndex: 2, position: "absolute", width: "100vw", height: "100vh", pointerEvents: "none" }}>
                <div style={{ pointerEvents: "auto" }}>
                    <ChatUI />
                    <MiniMap />
                    <CrossHair />
                    <StaminaBar stamina={stamina} />

                    <button
                        onClick={handleBackToLobby}
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            padding: "10px 20px",
                            background: "rgba(255, 70, 85, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "bold",
                            zIndex: 100
                        }}
                    >
                        BACK TO LOBBY
                    </button>
                </div>
            </div>
        </>
    );
};

export default UI;
