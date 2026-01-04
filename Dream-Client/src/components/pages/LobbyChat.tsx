import React, { useState, useRef, useEffect } from "react";
import { Send, Pin } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLobby } from "../../contexts/LobbyContext";

export default function LobbyChat() {
    const { chat, sendChat } = useLobby();
    const { user } = useAuth();

    const [message, setMessage] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [pinned, setPinned] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, isExpanded]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && user) {
            sendChat(message, user.id);
            setMessage("");
        }
    };

    return (
        <div
            className={`chat-container ${isExpanded || pinned ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="chat-header">
                <div className="chat-preview">
                    {chat.length > 0 ? (
                        <div className="last-message">
                            <span className="last-message-author">{chat[chat.length - 1].from}:</span>
                            <span className="last-message-text">{chat[chat.length - 1].message}</span>
                        </div>
                    ) : (
                        <div className="chat-placeholder">Lobby Chat</div>
                    )}
                </div>
                <button className={`pin-button ${pinned ? "pinned" : ""}`} onClick={() => setPinned(!pinned)}>
                    <Pin size={14} />
                </button>
            </div>

            {(isExpanded || pinned) && (
                <>
                    <div className="chat-content">
                        {chat.map((msg, i) => (
                            <div key={i} className="chat-message">
                                <div className="message-header">
                                    <span className="message-author">{msg.from}</span>
                                    <span className="message-time">Now</span>
                                </div>
                                <div className="message-text">{msg.message}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-container" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="send-button">
                            <Send size={16} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
