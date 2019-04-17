export interface IFilesFetchContext {
  folderPath?: string;
  showHideFiles?: boolean;
  lazyLoad?: boolean;
}

export interface IFolderStruct {
  loaded: boolean;
  exist: boolean;
  path: string;
  files: string[];
  folders: IFolderStruct[];
}

export interface IPreferenceConfig {
  updateAt?: number;
  darkMode?: boolean;
  rootFolder?: string;
}

export interface IAppFolderInit {
  folder?: string;
}

export interface ICopyFileOptions {
  sourcePath: string;
  targetPath: string;
}

export interface IUpdatePreferenceOptions {
  configs: Partial<IPreferenceConfig>;
}

export enum ErrorCode {
  Default = -1,
  Unknown = 0,
  PreferenceNotFound = 1,
  FileNotFound = 2,
  FileAlreadyExist = 3
}

export class AppError<T extends { [prop: string]: any } = any> {
  constructor(public readonly code: ErrorCode, public readonly message: string, public readonly extras: T = <any>{}) {}
}
