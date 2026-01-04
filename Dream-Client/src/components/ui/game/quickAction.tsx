import React, { useState, useEffect, useCallback } from "react";
import { ActionOption, Option } from "src/types/uiTypes";

interface QuickActionsProps {
    enabled?: boolean;
    actions: ActionOption[];
    onSelect?: (action: Option) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ enabled = true, actions, onSelect }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setIsEnabled(false);
        }
    }, [enabled]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key.toLowerCase() === "x" && !event.repeat && enabled) {
            setIsEnabled(true);
        }
    }, [enabled]);

    const handleKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "x") {
                setIsEnabled(false);
                if (onSelect && actions[selectedIndex] && isEnabled) {
                    onSelect({
                        id: actions[selectedIndex].id,
                        label: actions[selectedIndex].label,
                        description: actions[selectedIndex].description,
                        shortcut: actions[selectedIndex].shortcut,
                    });
                }
            }
        },
        [selectedIndex, onSelect, actions, isEnabled]
    );

    const handleWheel = useCallback(
        (event: WheelEvent) => {
            if (!isEnabled) return;

            event.preventDefault();
            const direction = event.deltaY > 0 ? 1 : -1;
            setSelectedIndex((prev) => {
                const newIndex = prev + direction;
                if (newIndex < 0) return actions.length - 1;
                if (newIndex >= actions.length) return 0;
                return newIndex;
            });
        },
        [isEnabled, actions.length]
    );

    const handleRightClick = useCallback(
        (event: MouseEvent) => {
            if (!isEnabled) return;
            if (event.button === 2) {
                event.preventDefault();
                setIsEnabled(false);
            }
        },
        [isEnabled]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("mousedown", handleRightClick);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("mousedown", handleRightClick);
        };
    }, [handleKeyDown, handleKeyUp, handleWheel, handleRightClick]);

    if (!isEnabled || !enabled) return null;

    return (
        <div className={`quick-actions-overlay`} onClick={(e) => e.stopPropagation()}>
            <div className="quick-actions-container">
                <div className="quick-actions-list">
                    {actions.map((action, index) => (
                        <div key={action.id} className={`action-item ${index === selectedIndex ? "selected" : ""}`}>
                            <div className="action-icon">{action.icon}</div>
                            <div className="action-content">
                                <div className="action-label">{action.label}</div>
                                <div className="action-description">{action.description}</div>
                            </div>
                            <div className="action-shortcut">{action.shortcut}</div>
                        </div>
                    ))}
                </div>

                <div className="quick-actions-instructions">
                    <p className="quick-actions-instructions-main">Scroll to navigate • Release X to select</p>
                    <p className="quick-actions-instructions-sub">
                        {actions[selectedIndex]?.label} - {actions[selectedIndex]?.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
