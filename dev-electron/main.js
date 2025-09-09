import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";

const drawingsPath = path.join(app.getPath("userData"), "drawings.json");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(process.cwd(), "preload.js"),
    },
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("save-drawings", (event, data) => {
  fs.writeFileSync(drawingsPath, JSON.stringify(data, null, 2), "utf-8");

  console.log(drawingsPath);
});

ipcMain.handle("load-drawings", () => {
  if (fs.existsSync(drawingsPath)) {
    return JSON.parse(fs.readFileSync(drawingsPath, "utf-8"));
  }
  return null;
});
