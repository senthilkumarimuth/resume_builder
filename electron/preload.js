const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveResume: (data) => ipcRenderer.invoke('save-resume', data),
  loadResume: () => ipcRenderer.invoke('load-resume'),
  clearResume: () => ipcRenderer.invoke('clear-resume'),
  // Profile management methods
  getAllProfiles: () => ipcRenderer.invoke('get-all-profiles'),
  getProfile: (profileId) => ipcRenderer.invoke('get-profile', profileId),
  saveProfile: (profileId, name, data, template) => ipcRenderer.invoke('save-profile', profileId, name, data, template),
  createProfile: (name, data, template) => ipcRenderer.invoke('create-profile', name, data, template),
  deleteProfile: (profileId) => ipcRenderer.invoke('delete-profile', profileId),
  duplicateProfile: (profileId, newName) => ipcRenderer.invoke('duplicate-profile', profileId, newName),
});
