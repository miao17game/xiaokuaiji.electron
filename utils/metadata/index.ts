export interface IFilesFetchContext {
  showHideFiles?: boolean;
}

export interface IFolderStruct {
  exist: boolean;
  path: string;
  files: string[];
  folders: IFolderStruct[];
}
