import { useState, useEffect } from "react";

type Movement = {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    cameraToggle: boolean;
    jump: boolean;
    sprint: boolean;
    debug: boolean;
};

export const usePlayerControls = (): Movement => {
    const keys: { [key: string]: keyof Movement } = {
        KeyW: "forward",
        KeyS: "backward",
        KeyA: "left",
        KeyD: "right",
        KeyP: "cameraToggle",
        Space: "jump",
        ShiftLeft: "sprint",
        Backquote: "debug",
    };
    const moveFieldByKey = (key: string): keyof Movement => keys[key];

    const [movement, setMovement] = useState<Movement>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        cameraToggle: false,
        jump: false,
        sprint: false,
        debug: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.pointerLockElement !== null) {
                const field = moveFieldByKey(e.code);
                setMovement((m) => ({
                    ...m,
                    [field]: field === "cameraToggle" ? !m.cameraToggle : true,
                }));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (document.pointerLockElement !== null) {
                const field = moveFieldByKey(e.code);
                if (field !== "cameraToggle") {
                    setMovement((m) => ({
                        ...m,
                        [field]: false,
                    }));
                }
            }
        };

        const handlePointerLockChange = () => {
            if (document.pointerLockElement === null) {
                setMovement((m) => ({
                    forward: false,
                    backward: false,
                    left: false,
                    right: false,
                    cameraToggle: m.cameraToggle,
                    jump: false,
                    sprint: false,
                    debug: false,
                }));
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("pointerlockchange", handlePointerLockChange);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
        };
        // eslint-disable-next-line
    }, []);

    return movement;
};
