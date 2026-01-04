import React from "react";

interface LoadingBarProps {
    progress: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
    return (
        <div className="loading-bar-container">
            <div className="loading-text">{`Loading... ${progress}%`}</div>
            <div className="loading-bar">
                <div className="loading-bar-progress" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
};

export default LoadingBar;
