import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>{message || "The page you're looking for doesn't exist or has been moved."}</p>
                <Link to="/" className="back-home-btn">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
