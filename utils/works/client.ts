import { ipcMain, BrowserWindow, Event } from "electron";
import { DEBUG_MODE_CHANGE, HOME_DIR_FILES_FETCH } from "../constants/events";
import { ROOT_FOLDER } from "../constants/paths";
import * as path from "path";
import * as fs from "fs";

export interface IFilesFetchContext {
  showHideFiles?: boolean;
}

export function clientEventsHook(win: BrowserWindow, main: typeof ipcMain) {
  main.on(DEBUG_MODE_CHANGE, (event: Event, data) => {
    const devToolOpened = win.webContents.isDevToolsOpened();
    if (devToolOpened) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });
  main.on(HOME_DIR_FILES_FETCH, (event: Event, { showHideFiles = false }: IFilesFetchContext = {}) => {
    event.sender.send(HOME_DIR_FILES_FETCH, {
      files: readFiles(ROOT_FOLDER, showHideFiles)
    });
  });
}

export interface IFileFetchResult {
  exist: boolean;
  path: string;
  files: string[];
  folders: IFileFetchResult[];
}

function readFiles(thisPath: string, showHideFiles = false) {
  const result: IFileFetchResult = {
    exist: false,
    path: thisPath,
    files: [],
    folders: []
  };
  if (!fs.existsSync(thisPath)) {
    return result;
  }
  result.exist = true;
  const children = fs.readdirSync(thisPath);
  const finalChilds = (showHideFiles ? children : children.filter(i => !i.startsWith("."))).map(p =>
    path.resolve(thisPath, p)
  );
  for (const each of finalChilds) {
    const status = fs.lstatSync(each);
    if (status.isDirectory()) {
      result.folders.push(readFiles(each, showHideFiles));
    } else if (status.isFile()) {
      result.files.push(each);
    }
  }
  return result;
}
