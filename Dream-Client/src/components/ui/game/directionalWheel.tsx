import React, { useState, useEffect, useRef } from "react";
import { WheelCatogories, Option } from "../../../types/uiTypes";

interface DirectionalWheelProps {
    enabled?: boolean;
    optionCategories: WheelCatogories[];
    onSelect?: (option: Option) => void;
}

const DirectionalWheel: React.FC<DirectionalWheelProps> = ({ enabled = true, optionCategories, onSelect }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const wheelRef = useRef<HTMLDivElement>(null);

    const currentCategory = optionCategories[currentSetIndex];
    const currentOptions = currentCategory.options;

    useEffect(() => {
        if (!enabled) {
            setIsEnabled(false);
        }
    }, [enabled]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "t" && !isEnabled && !e.repeat && enabled) {
                setIsEnabled(true);
                setSelectedIndex(null);
                setMousePosition({ x: 0, y: 0 });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "t" && isEnabled) {
                if (selectedIndex !== null) {
                    onSelect?.(currentOptions[selectedIndex]);
                }
                setIsEnabled(false);
                setSelectedIndex(null);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isEnabled) return;

            if (document.pointerLockElement) {
                setMousePosition((prev) => {
                    const newX = prev.x + e.movementX;
                    const newY = prev.y + e.movementY;
                    return { x: newX, y: newY };
                });
            }
        };

        const analyzePosition = () => {
            if (!isEnabled) return;

            const distance = Math.sqrt(mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y);

            if (distance < 40) {
                setSelectedIndex(null);
                return;
            }

            let angle = Math.atan2(mousePosition.y, mousePosition.x);
            angle = (angle + Math.PI * 2) % (Math.PI * 2);

            let degrees = ((angle * 180) / Math.PI + 90) % 360;

            const segmentAngle = 360 / currentOptions.length;
            const selectedIdx = Math.floor(degrees / segmentAngle);

            setSelectedIndex(selectedIdx);
        };

        analyzePosition();

        const handleWheel = (e: WheelEvent) => {
            if (!isEnabled) return;
            e.preventDefault();

            if (e.deltaY > 0) {
                setCurrentSetIndex((prev) => (prev + 1) % optionCategories.length);
            } else {
                setCurrentSetIndex((prev) => (prev - 1 + optionCategories.length) % optionCategories.length);
            }
            setSelectedIndex(null);
        };

        const handleRightClick = (event: MouseEvent) => {
            if (!isEnabled) return;
            if (event.button === 2) {
                event.preventDefault();
                setIsEnabled(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("mousedown", handleRightClick);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("mousedown", handleRightClick);
        };
    }, [isEnabled, selectedIndex, currentOptions, onSelect, currentSetIndex, mousePosition, optionCategories.length, enabled]);

    if (!isEnabled || !enabled) return null;

    const createSegmentPath = (index: number, total: number, innerRadius: number, outerRadius: number) => {
        const angle = 360 / total;
        const startAngle = (index * angle - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180);

        const x1 = Math.cos(startAngle);
        const y1 = Math.sin(startAngle);
        const x2 = Math.cos(endAngle);
        const y2 = Math.sin(endAngle);

        const largeArcFlag = angle > 180 ? 1 : 0;

        return `M ${x1 * innerRadius} ${y1 * innerRadius} 
            L ${x1 * outerRadius} ${y1 * outerRadius} 
            A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2 * outerRadius} ${y2 * outerRadius}
            L ${x2 * innerRadius} ${y2 * innerRadius} 
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1 * innerRadius} ${y1 * innerRadius} Z`;
    };

    const getTextPosition = (index: number, total: number, radius: number) => {
        const angle = ((index * 360) / total - 90) * (Math.PI / 180) + (180 / total) * (Math.PI / 180);
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };

    const getPreviousCategory = () => {
        const prevIndex = (currentSetIndex - 1 + optionCategories.length) % optionCategories.length;
        return optionCategories[prevIndex];
    };

    const getNextCategory = () => {
        const nextIndex = (currentSetIndex + 1) % optionCategories.length;
        return optionCategories[nextIndex];
    };

    return (
        <div className="directional-wheel-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="category-indicators">
                <div className="category-indicator category-up">
                    <div className="category-arrow">↑</div>
                    <div className="category-name">{getPreviousCategory().name}</div>
                </div>
                <div className="category-indicator category-current">
                    <div className="category-name">{currentCategory.name}</div>
                </div>
                <div className="category-indicator category-down">
                    <div className="category-arrow">↓</div>
                    <div className="category-name">{getNextCategory().name}</div>
                </div>
            </div>

            <div className="directional-wheel-container" ref={wheelRef}>
                <svg className="directional-wheel-svg" width="450" height="450" viewBox="-225 -225 450 450">
                    <circle cx="0" cy="0" r="200" className="directional-wheel-outer-ring" />

                    {currentOptions.map((option, index) => (
                        <g key={option.id}>
                            <path d={createSegmentPath(index, currentOptions.length, 60, 200)} className={`directional-wheel-segment ${selectedIndex === index ? "selected" : ""}`} />

                            <text x={getTextPosition(index, currentOptions.length, 140).x} y={getTextPosition(index, currentOptions.length, 140).y} className={"directional-wheel-text"}>
                                {option.label}
                            </text>
                            <text x={getTextPosition(index, currentOptions.length, 140).x} y={getTextPosition(index, currentOptions.length, 140).y + 20} className="directional-wheel-shortcut">
                                {option.shortcut}
                            </text>
                        </g>
                    ))}

                    <circle cx="0" cy="0" r="40" className="directional-wheel-center" />

                    <circle
                        cx={selectedIndex !== null ? getTextPosition(selectedIndex, currentOptions.length, 100).x : 0}
                        cy={selectedIndex !== null ? getTextPosition(selectedIndex, currentOptions.length, 100).y : 0}
                        r="8"
                        className={`directional-wheel-indicator ${selectedIndex !== null ? "enabled" : "center"}`}
                    />
                </svg>

                <div className="directional-wheel-instructions">
                    <div className="directional-wheel-instructions-main">Move mouse to select • Scroll to change categories • Right-click to cancel</div>
                    <div className="directional-wheel-instructions-sub">{selectedIndex !== null ? currentOptions[selectedIndex]?.description : `${currentCategory.name} commands`}</div>
                </div>
            </div>
        </div>
    );
};

export default DirectionalWheel;
