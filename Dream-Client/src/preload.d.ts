export interface IElectronAPI {
    loadPreferences: () => Promise<void>;
}

export interface ICustomAPI {
    onUpdateProgress: (callback: (progress: any) => void) => void;
    onUpdateDownloaded: (callback: () => void) => void;
}

declare global {
    interface Window {
        electron: IElectronAPI;
        api: ICustomAPI;
    }
}
