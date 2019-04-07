export interface IFilesFetchContext {
  showHideFiles?: boolean;
}

export interface IFolderStruct {
  exist: boolean;
  path: string;
  files: string[];
  folders: IFolderStruct[];
}

export interface IPreferenceConfig {
  updateAt?: number;
  rootFolder?: string;
}

export enum ErrorCode {
  Unknown = 0,
  PreferenceNotFound = 1
}

export class AppError<T extends { [prop: string]: any } = any> {
  constructor(public readonly code: ErrorCode, public readonly message: string, public readonly extras: T = <any>{}) {}
}
