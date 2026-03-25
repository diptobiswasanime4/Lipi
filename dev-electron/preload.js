const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveDrawings: (data) => ipcRenderer.send("save-drawings", data),
  loadDrawings: () => ipcRenderer.invoke("load-drawings"),
  openNotebook: () => ipcRenderer.send("open-notebook"),
});
