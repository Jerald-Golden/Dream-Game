import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useBackOnEscape from "src/utils/hooks/useBackOnEscape";

export default function Settings() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useBackOnEscape();

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await updateProfile({ full_name: fullName });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <button className="close-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
            </button>

            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account preferences</p>
            </div>

            <div className="settings-content">
                <div className="settings-section">
                    <h2>Profile</h2>
                    <form className="settings-form" onSubmit={handleUpdateProfile}>
                        {message && <div className={`message ${message.type}`}>{message.text}</div>}

                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-input disabled" value={user?.email || ""} disabled />
                            <small>Email cannot be changed</small>
                        </div>

                        <button type="submit" className="update-btn" disabled={loading}>
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="settings-section">
                    <h2>Account Information</h2>
                    <div className="account-info">
                        <div className="info-row">
                            <span className="info-label">User ID</span>
                            <span className="info-value">{user?.id}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Last Sign In</span>
                            <span className="info-value">{new Date(user?.last_sign_in_at || "").toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
