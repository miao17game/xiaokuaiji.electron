import { ipcMain, BrowserWindow } from "electron";
import { DEBUG_MODE_CHANGE } from "../constants/events";

export function clientEventsHook(win: BrowserWindow, main: typeof ipcMain) {
  main.on(DEBUG_MODE_CHANGE, (event, data) => {
    const devToolOpened = win.webContents.isDevToolsOpened();
    if (devToolOpened) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });
}
