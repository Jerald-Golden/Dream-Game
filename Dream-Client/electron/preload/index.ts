import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
    // Add any custom APIs you want to expose to the renderer process here
    // For example:
    // sendMessage: (message: string) => ipcRenderer.send('message', message),
    // onMessage: (callback: (message: string) => void) => ipcRenderer.on('message', (_, message) => callback(message))
    onUpdateProgress: (callback: (progress: any) => void) =>
        ipcRenderer.on("update-progress", (_, progress) => callback(progress)),
    onUpdateDownloaded: (callback: () => void) =>
        ipcRenderer.on("update-downloaded", (_, value) => callback()),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
