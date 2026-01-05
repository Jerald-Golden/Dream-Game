import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";

const SERVER_URL = import.meta.env.VITE_DREAMSERVER_URL;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (data: { full_name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("dream_access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${SERVER_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setUser(data.user);
                        setSession({ access_token: token, user: data.user } as Session);
                    } else {
                        throw new Error("Invalid session");
                    }
                } else {
                    throw new Error("Session check failed");
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                localStorage.removeItem("dream_access_token");
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        const res = await fetch(`${SERVER_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        if (data.session) {
            localStorage.setItem("dream_access_token", data.session.access_token);
            setSession(data.session);
            setUser(data.session.user);
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        const res = await fetch(`${SERVER_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        if (data.session) {
            localStorage.setItem("dream_access_token", data.session.access_token);
            setSession(data.session);
            setUser(data.session.user);
        }
    };

    const signOut = async () => {
        const token = localStorage.getItem("dream_access_token");
        if (token) {
            try {
                await fetch(`${SERVER_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        localStorage.removeItem("dream_access_token");
        setUser(null);
        setSession(null);
    };

    const updateProfile = async (data: { full_name?: string }) => {
        // Not implemented on server yet, can add endpoint later.
        console.warn("updateProfile: Not implemented on server side yet.");
        // For now, minimal support or error
    };

    const value = {
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
