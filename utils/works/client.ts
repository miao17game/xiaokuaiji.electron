import { ipcMain, BrowserWindow, Event } from "electron";
import { ClientEvent } from "../constants/events";
import { ROOT_FOLDER, PREFERENCE_CONF } from "../constants/paths";
import { IFilesFetchContext, IFolderStruct as IFileFetchResult } from "../metadata";
import * as path from "path";
import * as fs from "fs";

export function clientEventsHook(win: BrowserWindow, main: typeof ipcMain) {
  main.on(ClientEvent.DebugMode, (event: Event, data) => {
    const devToolOpened = win.webContents.isDevToolsOpened();
    if (devToolOpened) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });
  main.on(ClientEvent.FetchFiles, (event: Event, { showHideFiles = false }: IFilesFetchContext = {}) => {
    event.sender.send(ClientEvent.FetchFiles, {
      files: readFiles(ROOT_FOLDER, showHideFiles)
    });
  });
  main.on(ClientEvent.InitAppFolder, (event: Event, { folder = ROOT_FOLDER } = {}) => {
    if (fs.existsSync(folder)) return;
    fs.mkdir(folder, error => event.sender.send(ClientEvent.InitAppFolder, error || true));
  });
  main.on(ClientEvent.FetchPreferences, (event: Event, { path = PREFERENCE_CONF }) => {
    let config: any = { updateAt: new Date().getTime() };
    let error: Error;
    if (!fs.existsSync(path)) {
      fs.appendFileSync(path, JSON.stringify({ updateAt: new Date().getTime() }), { flag: "w" });
    } else {
      try {
        const confStr = fs.readFileSync(path).toString();
        config = JSON.parse(confStr);
      } catch (_e) {
        error = _e;
      }
    }
    event.sender.send(ClientEvent.FetchPreferences, { configs: config, error });
  });
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
