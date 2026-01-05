import React, { useEffect, useState } from "react";

const UpdateLoader: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("Updating...");

    useEffect(() => {
        // Check if window.api exists (it won't in pure web dev mode if not mocked, but will in Electron)
        if (window.api && window.api.onUpdateProgress) {
            window.api.onUpdateProgress((progressObj: any) => {
                setUpdating(true);
                setProgress(Math.round(progressObj.percent));
            });

            window.api.onUpdateDownloaded(() => {
                setProgress(100);
                setMessage("Update Downloaded. Restarting...");
            });
        }
    }, []);

    if (!updating) return null;

    return (
        <div className="lobby-dashboard-dialog-overlay" style={{ zIndex: 9999 }}>
            <div className="lobby-dashboard-dialog-content" style={{ maxWidth: "400px" }}>
                <div className="lobby-dashboard-dialog-header" style={{ justifyContent: "center" }}>
                    <h3 className="lobby-dashboard-dialog-title">Application Update</h3>
                </div>
                <div className="lobby-dashboard-dialog-body">
                    <p
                        className="lobby-dashboard-session-info-details"
                        style={{ textAlign: "center", marginBottom: "1rem" }}
                    >
                        {message}
                    </p>

                    <div
                        style={{
                            width: "100%",
                            height: "10px",
                            backgroundColor: "hsl(200, 20%, 8%)",
                            borderRadius: "5px",
                            border: "1px solid hsl(180, 40%, 30%)",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                backgroundColor: "hsl(180, 100%, 50%)",
                                transition: "width 0.3s ease",
                                boxShadow: "0 0 10px hsl(180, 100%, 50%, 0.5)",
                            }}
                        />
                    </div>
                    <p
                        className="lobby-dashboard-session-info-details"
                        style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.75rem" }}
                    >
                        {progress}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpdateLoader;
