import { Outlet } from "react-router-dom";
import { SocketProvider } from "../../contexts/SocketContext";
import { LobbyProvider } from "../../contexts/LobbyContext";

export default function SocketLayout() {
    return (
        <SocketProvider>
            <LobbyProvider>
                <Outlet />
            </LobbyProvider>
        </SocketProvider>
    );
}
