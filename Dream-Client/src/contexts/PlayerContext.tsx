import React, { createContext, useContext, useRef } from "react";
import { RapierRigidBody } from "@react-three/rapier";

interface PlayerContextType {
    characterRef: React.RefObject<RapierRigidBody | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const characterRef = useRef<RapierRigidBody | null>(null);

    return (
        <PlayerContext.Provider value={{ characterRef }}>
            {children}
        </PlayerContext.Provider>
    );
}
