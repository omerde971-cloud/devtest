import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  version: {
    app: () => ipcRenderer.invoke('app-version'),
  },
  platform: process.platform,
})
