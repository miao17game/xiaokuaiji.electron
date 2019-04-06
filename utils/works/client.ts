import { ipcMain, BrowserWindow, Event } from "electron";
import { ClientEvent } from "../constants/events";
import { ROOT_FOLDER, PREFERENCE_CONF } from "../constants/paths";
import { IFilesFetchContext, IFolderStruct as IFileFetchResult, IPreferenceConfig } from "../metadata";
import * as path from "path";
import * as fs from "fs";

export function clientEventsHook(win: BrowserWindow, main: typeof ipcMain) {
  let { configs: preferenceConf } = loadPreference(PREFERENCE_CONF);
  main.on(ClientEvent.DebugMode, (event: Event) => {
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
  main.on(ClientEvent.FetchPreferences, (event: Event, {}) => {
    if (!preferenceConf) {
      const result = loadPreference(PREFERENCE_CONF);
      preferenceConf = result.configs;
    }
    event.sender.send(ClientEvent.FetchPreferences, { configs: preferenceConf });
  });
  main.on(ClientEvent.UpdatePreferences, (event: Event, { configs }) => {
    preferenceConf = {
      ...preferenceConf,
      ...configs,
      updateAt: new Date().getTime()
    };
    try {
      fs.appendFileSync(PREFERENCE_CONF, JSON.stringify(preferenceConf), { flag: "w+" });
      event.sender.send(ClientEvent.UpdatePreferences, true);
    } catch (error) {
      event.sender.send(ClientEvent.UpdatePreferences, error);
    }
  });
}

function loadPreference(path: any): { configs?: IPreferenceConfig; errors?: Error } {
  try {
    if (!fs.existsSync(path)) {
      const defaultConfigs = { updateAt: new Date().getTime() };
      fs.appendFileSync(path, JSON.stringify(defaultConfigs), { flag: "w+" });
      return { configs: defaultConfigs };
    } else {
      const confStr = fs.readFileSync(path).toString();
      return { configs: JSON.parse(confStr) };
    }
  } catch (_e) {
    return { errors: _e };
  }
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
