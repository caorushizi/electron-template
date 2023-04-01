import { contextBridge, ipcRenderer } from "electron/renderer";

const apiFunctions: Record<string, any> = {};

const apiKey = "electron";
const api: ElectronAPI = {
  index: () => ipcRenderer.invoke("index"),
  rendererEvent: (channel, funcId, listener) => {
    const key = `${channel}-${funcId}`;
    apiFunctions[key] = listener;
    ipcRenderer.on(channel, listener);
  },
  removeEventListener: (channel, funcId) => {
    const key = `${channel}-${funcId}`;
    const fun = apiFunctions[key];
    ipcRenderer.removeListener(channel, fun);
    delete apiFunctions[key];
  },
};

contextBridge.exposeInMainWorld(apiKey, api);
