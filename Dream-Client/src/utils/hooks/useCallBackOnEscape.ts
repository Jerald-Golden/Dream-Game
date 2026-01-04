import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useCallBackOnEscape(callback: () => void, enabled: boolean = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled, callback]);
}

export default useCallBackOnEscape;
