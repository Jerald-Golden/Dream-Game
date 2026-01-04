import { useState, useEffect, useRef } from "react";
import { useRoom } from "@features/games/among-us/multiplayer/roomContext";
import { useAuth } from "../../../contexts/AuthContext";

interface Message {
    sender: string;
    senderName?: string;
    message: string;
}

const ChatUI = () => {
    const { socket, roomName } = useRoom();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleChat = (data: Message) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on("chat", handleChat);

        return () => {
            socket.off("chat", handleChat);
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!socket || !inputMessage.trim() || !user || !roomName) return;

        const message = inputMessage.trim();
        socket.emit("chat", {
            roomName,
            message,
            userId: user.id,
            username: user.user_metadata?.full_name || "Unknown"
        });

        // Optimistic update? Server broadcasts, so maybe wait for server.
        // But for responsiveness we can add it.
        // setMessages((prev) => [...prev, { sender: user.user_metadata?.full_name || "You", message }]); 

        setInputMessage("");
    };

    return (
        <div className="chat-container" onClick={(e) => e.stopPropagation()}>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong
                            style={{
                                color: "#007bff",
                            }}
                        >
                            {msg.sender}:
                        </strong>{" "}
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
