import { useEffect } from "react";

/**
 * useCallBackOnKey
 *
 * Calls the provided callback when the specified key is pressed.
 *
 * @param key - The key to listen for (e.g., "x", "Escape", "t", etc.)
 * @param callback - The function to call when the key is pressed
 * @param options - Optional: {
 *   eventType?: "keydown" | "keyup",
 *   noRepeat?: boolean,
 *   enabled?: boolean,
 *   dependencies?: any[]
 * }
 */
type UseCallBackOnKeyOptions = {
    eventType?: "keydown" | "keyup";
    noRepeat?: boolean;
    enabled?: boolean;
    dependencies?: any[];
};

function useCallBackOnKey(key: string, callback: (event: KeyboardEvent) => void, options?: UseCallBackOnKeyOptions) {
    const { eventType = "keydown", noRepeat = false, enabled = true, dependencies = [] } = options || {};

    useEffect(() => {
        if (!enabled || typeof callback !== "function") return;

        const handler = (event: KeyboardEvent) => {
            const keyMatch = event.key === key || event.key.toLowerCase() === key.toLowerCase();
            if (keyMatch) {
                event.preventDefault();
                if (noRepeat && event.repeat) return;
                callback(event);
            }
        };

        window.addEventListener(eventType, handler);
        return () => {
            window.removeEventListener(eventType, handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, callback, eventType, noRepeat, enabled, ...dependencies]);
}

export default useCallBackOnKey;
