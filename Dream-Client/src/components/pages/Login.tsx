import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const { user, signInWithEmail, signUpWithEmail, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                if (!fullName.trim()) throw new Error("Please enter your name");
                await signUpWithEmail(email, password, fullName);
                // For Supabase, usually you need to confirm email or it auto-logs in. 
                // Assuming auto-login or message to check email.
                // But for this project likely auto-login.
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>DreamGame</h1>
                    <p>{isSignUp ? "Create your account" : "Welcome back, Traveler"}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="email-form">
                        {isSignUp && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner" style={{ width: "20px", height: "20px", borderTopColor: "white" }}></span>
                        ) : isSignUp ? (
                            "Sign Up"
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button className="switch-btn" onClick={() => setIsSignUp(!isSignUp)} disabled={isLoading}>
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
