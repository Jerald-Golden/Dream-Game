import { useEffect } from "react";

function useBackOnEscape(enabled: boolean = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                window.history.back();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled]);
}

export default useBackOnEscape;
