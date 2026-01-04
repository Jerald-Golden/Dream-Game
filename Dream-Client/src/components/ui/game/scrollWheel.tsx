import React, { useCallback, useEffect, useState } from "react";
import { Option } from "src/types/uiTypes";

interface RadialWheelProps {
    enabled?: boolean;
    options: Option[];
    onSelect?: (option: Option) => void;
}

const ScrollWheelMenu: React.FC<RadialWheelProps> = ({ enabled = true, options, onSelect }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setIsEnabled(false);
        }
    }, [enabled]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "c" && !event.repeat && enabled) {
                setIsEnabled(true);
            }
        },
        [enabled]
    );

    const handleKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "c") {
                setIsEnabled(false);
                if (onSelect && options[selectedIndex] && isEnabled) {
                    onSelect(options[selectedIndex]);
                }
            }
        },
        [selectedIndex, onSelect, options, isEnabled]
    );

    const handleWheel = useCallback(
        (event: WheelEvent) => {
            if (!isEnabled) return;

            event.preventDefault();
            const direction = event.deltaY > 0 ? 1 : -1;
            setSelectedIndex((prev) => {
                const newIndex = prev + direction;
                if (newIndex < 0) return options.length - 1;
                if (newIndex >= options.length) return 0;
                return newIndex;
            });
        },
        [isEnabled, options.length]
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

    if (!isEnabled) return null;
    console.log("isEnabled: ", isEnabled);

    const segmentAngle = 360 / options.length;
    const centerRadius = 80;
    const outerRadius = 200;

    const createSegmentPath = (index: number) => {
        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

        const x1 = centerRadius * Math.cos(startAngle);
        const y1 = centerRadius * Math.sin(startAngle);
        const x2 = outerRadius * Math.cos(startAngle);
        const y2 = outerRadius * Math.sin(startAngle);

        const x3 = outerRadius * Math.cos(endAngle);
        const y3 = outerRadius * Math.sin(endAngle);
        const x4 = centerRadius * Math.cos(endAngle);
        const y4 = centerRadius * Math.sin(endAngle);

        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${centerRadius} ${centerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
    };

    const getTextPosition = (index: number) => {
        const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
        const radius = (centerRadius + outerRadius) / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { x, y };
    };

    return (
        <div className={`radial-wheel-overlay`} onClick={(e) => e.stopPropagation()}>
            <div className="radial-wheel-container">
                <svg width="450" height="450" viewBox="-225 -225 450 450" className="radial-wheel-svg">
                    {options.map((option, index) => {
                        const isSelected = index === selectedIndex;
                        const textPos = getTextPosition(index);

                        return (
                            <g key={option.id}>
                                <path d={createSegmentPath(index)} className={`scroll-wheel-segment ${isSelected ? "selected" : ""}`} />

                                <text
                                    x={textPos.x}
                                    y={textPos.y}
                                    className={`scroll-wheel-text ${isSelected ? "selected" : ""}`}
                                    style={{
                                        transformOrigin: `${textPos.x}px ${textPos.y}px`,
                                    }}
                                >
                                    {option.label}
                                </text>

                                {option.shortcut && (
                                    <text x={textPos.x} y={textPos.y + 16} className={`scroll-wheel-shortcut ${isSelected ? "selected" : ""}`}>
                                        {option.shortcut}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    <circle cx="0" cy="0" r={centerRadius} className="scroll-wheel-center" />

                    <text x="0" y="0" className="scroll-wheel-center-text" textAnchor="middle" dominantBaseline="middle">
                        {options[selectedIndex]?.label}
                    </text>
                </svg>

                <div className="scroll-wheel-instructions">
                    <p className="scroll-wheel-instructions-main">Scroll to navigate • Release C to select • Right-click to cancel</p>
                    <p className="scroll-wheel-instructions-sub">{options[selectedIndex]?.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ScrollWheelMenu;
