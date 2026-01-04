import { useState, useEffect } from "react";
import { HotBarItem } from "src/types/uiTypes";

type HotBarProps = {
    visible?: boolean;
    hotBarItems: (HotBarItem | null)[];
};

const HotBar: React.FC<HotBarProps> = ({ visible = true, hotBarItems }) => {
    const [activeSlot, setActiveSlot] = useState(0);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const key = event.key;
            const num = parseInt(key);

            if (num >= 1 && num <= 9) {
                event.preventDefault();
                setActiveSlot(num - 1);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    if (!visible) return null;

    const slots = Array.from({ length: 9 }, (_, index) => {
        return hotBarItems[index] || null;
    });

    return (
        <div className={"hotbar-container"} onClick={(e) => e.stopPropagation()}>
            {slots.map((item, index) => {
                const isActive = activeSlot === index;
                const slotNumber = index + 1;

                return (
                    <div
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlot(index);
                        }}
                        className={`hotbar-slot ${isActive ? "active" : ""}`}
                    >
                        <div className={`slot-number ${isActive ? "active" : ""}`}>{slotNumber}</div>

                        {item && (
                            <>
                                <div className="item-container">
                                    <img src={item.image} alt={item.name} className={`item-image ${isActive ? "active" : ""}`} draggable={false} />
                                </div>

                                {item.count > 1 && <div className="item-count">{item.count > 99 ? "99+" : item.count}</div>}

                                {isActive && <div className="active-glow" />}
                            </>
                        )}

                        {!item && (
                            <div className="empty-slot">
                                <div className="empty-slot-indicator" />
                            </div>
                        )}

                        <div className="hover-effect" />
                    </div>
                );
            })}
        </div>
    );
};

export default HotBar;
