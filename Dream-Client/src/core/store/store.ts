import { create } from "zustand";

interface StaminaState {
    stamina: number;
    setStamina: (x: number) => void;
}

export const useStamina = create<StaminaState>((set) => ({
    stamina: 100,
    setStamina: (x: number) => set(() => ({ stamina: x })),
}));

interface RoomState {
    roomData: {
        roomName: string | undefined;
        roomId: string | undefined;
        password?: string | undefined;
    };
    setRoomData: (name: string, id: string | undefined, password?: string) => void;
}

export const useRoomData = create<RoomState>((set) => ({
    roomData: {
        roomName: undefined,
        roomId: undefined,
        password: undefined,
    },
    setRoomData: (name: string, id: string | undefined, password?: string) =>
        set(() => ({ roomData: { roomName: name, roomId: id, password } })),
}));
