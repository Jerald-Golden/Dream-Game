import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="p-4 bg-red-900/50 border border-red-500 rounded text-white">
                    <h2 className="text-lg font-bold mb-2">Something went wrong.</h2>
                    <p className="font-mono text-sm">{this.state.error?.message}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
