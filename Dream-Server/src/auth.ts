import express from "express";
import { supabase } from "./supabase";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    return res.json(data);
});

router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.json(data);
});

router.post("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        await supabase.auth.admin.signOut(token); // Force sign out if using admin, or just let client discard token.
    }
    // Supabase stateless auth: just discard token on client.
    // But if we want to invalidate it... only possible with RLS or tracking generic sessions?
    // Actually, supabase.auth.signOut() clears local session. On server, we can't easily "invalidate" a JWT unless we have a blacklist or use session management.
    // For now, we just return success.
    return res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    return res.json({ user });
});

export default router;
