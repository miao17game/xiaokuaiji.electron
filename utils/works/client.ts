import { ipcMain, BrowserWindow, Event } from "electron";
import { ClientEvent } from "../constants/events";
import { ROOT_FOLDER, PREFERENCE_CONF } from "../constants/paths";
import {
  IFilesFetchContext,
  IFolderStruct as IFileFetchResult,
  IPreferenceConfig,
  AppError,
  ErrorCode
} from "../metadata";
import * as path from "path";
import * as fs from "fs";

export function clientEventsHook(win: BrowserWindow, main: typeof ipcMain) {
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
    fs.mkdir(folder, error => {
      event.sender.send(ClientEvent.InitAppFolder, !error ? true : createUnknownError(error));
    });
  });
  main.on(ClientEvent.FetchPreferences, (event: Event, {}) => {
    event.sender.send(ClientEvent.FetchPreferences, tryLoadPreference());
  });
  main.on(ClientEvent.UpdatePreferences, (event: Event, { configs }) => {
    const { configs: sourceConfs, error: errors } = tryLoadPreference();
    if (errors) {
      return event.sender.send(ClientEvent.UpdatePreferences, errors);
    }
    const preferenceConf = {
      ...sourceConfs,
      ...configs,
      updateAt: createStamp()
    };
    try {
      fs.appendFileSync(PREFERENCE_CONF, JSON.stringify(preferenceConf, null, "  "), { flag: "w+" });
      event.sender.send(ClientEvent.UpdatePreferences, true);
    } catch (error) {
      event.sender.send(ClientEvent.UpdatePreferences, createUnknownError(error));
    }
  });
}

function tryLoadPreference(path = PREFERENCE_CONF) {
  let error: AppError;
  let preferenceConf: IPreferenceConfig;
  try {
    if (!fs.existsSync(path)) {
      const defaultConfigs = { updateAt: createStamp() };
      fs.appendFileSync(path, JSON.stringify(defaultConfigs, null, "  "), { flag: "w+" });
      preferenceConf = defaultConfigs;
    } else {
      const confStr = fs.readFileSync(path).toString();
      preferenceConf = JSON.parse(confStr);
    }
  } catch (_e) {
    if (_e.code === "ENOENT" && _e.errno === -2 && _e.syscall === "open") {
      error = new AppError(ErrorCode.PreferenceNotFound, "preference file not found.", {
        syscall: _e.syscall,
        path: _e.path,
        msg: _e.message,
        stack: _e.stack
      });
    } else {
      error = createUnknownError(error);
    }
  }
  return { configs: preferenceConf, error };
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

function createStamp() {
  return new Date().getTime();
}

function createUnknownError(error: any) {
  return new AppError(ErrorCode.Unknown, "unknown error.", {
    ...error,
    msg: error.message,
    stack: error.stack
  });
}
