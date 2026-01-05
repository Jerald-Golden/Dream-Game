export interface PlayerState {
    id: string; // socketId or userId
    userId: string;
    username: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    state: string;
}

export interface RoomContextType {
    roomName: string | null;
    players: PlayerState[];
    loading: boolean;
    sendMove: (
        position: { x: number; y: number; z: number },
        rotation: { x: number; y: number; z: number },
        state: string,
    ) => void;
    // socket is internal mostly, but exposed if needed.
    // If exposed, it might trigger HMR warnings if not handled carefully, but usually distinct types are fine.
    // We will exclude 'socket' from the type if we want to be strict, but the provider provides it.
    // Let's keep it but import Socket type.
    socket: any;
}
