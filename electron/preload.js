const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveResume: (data) => ipcRenderer.invoke('save-resume', data),
  loadResume: () => ipcRenderer.invoke('load-resume'),
  clearResume: () => ipcRenderer.invoke('clear-resume'),
});
