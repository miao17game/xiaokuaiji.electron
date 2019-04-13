import * as path from "path";
import * as fs from "fs";
import { IpcMain, BrowserWindow, Event } from "electron";
import { DefaultEventLoader, IRegisterOptions, createUnknownError, createStamp } from "./base";
import { ROOT_FOLDER, PREFERENCE_CONF, OS_HOME } from "../constants/paths";
import {
  IFilesFetchContext,
  IFolderStruct as IFileFetchResult,
  IPreferenceConfig,
  AppError,
  ErrorCode
} from "../metadata";

interface IClientLoader {
  openCloseDevTool(args: {}): void;
  readLocalFiles(args: IFilesFetchContext): { files: IFileFetchResult };
  initAppFolder(args: { folder?: string }): Promise<boolean | AppError>;
  fetchPreference(): { configs?: IPreferenceConfig; error?: AppError };
  updatePreference(args: { configs: Partial<IPreferenceConfig> }): boolean | AppError;
}

export class EventLoader extends DefaultEventLoader<IClientLoader> implements IClientLoader {
  constructor(private win: BrowserWindow, ipcMain: IpcMain) {
    super(ipcMain);
  }

  public openCloseDevTool() {
    const devToolOpened = this.win.webContents.isDevToolsOpened();
    if (devToolOpened) {
      this.win.webContents.closeDevTools();
    } else {
      this.win.webContents.openDevTools();
    }
  }

  public readLocalFiles({ folderPath = undefined, showHideFiles = false, lazyLoad = false }) {
    let p: string = ROOT_FOLDER;
    if (folderPath) {
      if (folderPath.startsWith(OS_HOME)) {
        p = folderPath;
      } else {
        p = path.join(OS_HOME, folderPath);
      }
    }
    const fies = readFiles(p, true, showHideFiles, lazyLoad);
    return {
      files: {
        ...fies,
        loaded: true
      }
    };
  }

  public initAppFolder({ folder = ROOT_FOLDER }) {
    if (fs.existsSync(folder)) return;
    return new Promise<boolean | AppError>((resolve, reject) => {
      fs.mkdir(folder, error => resolve(!error ? true : createUnknownError(error)));
    });
  }

  public fetchPreference() {
    return tryLoadPreference();
  }

  public updatePreference({ configs = {} }) {
    const { configs: sourceConfs, error: errors } = tryLoadPreference();
    if (errors) {
      return errors;
    }
    const preferenceConf = {
      ...sourceConfs,
      ...configs,
      updateAt: createStamp()
    };
    try {
      fs.appendFileSync(PREFERENCE_CONF, JSON.stringify(preferenceConf, null, "  "), { flag: "w+" });
      return true;
    } catch (error) {
      return createUnknownError(error);
    }
  }
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

function readFiles(thisPath: string, isRoot = false, showHideFiles = false, lazyLoad = false) {
  const result: IFileFetchResult = {
    loaded: false,
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
    if (lazyLoad && !isRoot) break;
    const status = fs.lstatSync(each);
    if (status.isDirectory()) {
      result.folders.push(readFiles(each, false, showHideFiles, lazyLoad));
    } else if (status.isFile()) {
      result.files.push(each);
    }
    result.loaded = true;
  }
  return result;
}
