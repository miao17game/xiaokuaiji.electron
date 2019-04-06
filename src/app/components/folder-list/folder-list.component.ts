import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { IFileFetchResult } from "../../../../utils/works/client";
import { Source } from "webpack-sources";

interface IViewContext {
  exist: boolean;
  path: string;
  files: string[];
  folders: IViewContext[];
  expanded: boolean;
  isRoot: boolean;
}

@Component({
  selector: "folder-list",
  templateUrl: "./folder-list.html",
  styleUrls: ["./style.scss"]
})
export class FolderListComponent implements OnInit, OnChanges {
  @Input() context: IFileFetchResult;
  @Output() onFolderClick = new EventEmitter<IFileFetchResult>();
  @Output() onFileClick = new EventEmitter<string>();

  private viewContext: IViewContext = {
    exist: false,
    path: "",
    files: [],
    folders: [],
    expanded: false,
    isRoot: true
  };

  get reference() {
    return this.viewContext || { exist: false };
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    for (const key in changes) {
      if (key === "context") {
        this.viewContext = buildViewContext(changes[key].currentValue);
        this.viewContext.expanded = true;
        this.viewContext.isRoot = true;
      }
    }
  }

  public onFileTapped(path: string) {
    this.onFileClick.emit(path);
  }

  public onExpanded(folder: IViewContext) {
    folder.expanded = !folder.expanded;
    this.onFolderClick.emit(readFilesResult(folder));
  }
}

function buildViewContext(source: IFileFetchResult): IViewContext {
  return {
    exist: source.exist,
    path: source.path,
    files: source.files || [],
    folders: (source.folders || []).map(i => buildViewContext(i)),
    expanded: false,
    isRoot: false
  };
}

function readFilesResult(source: IViewContext): IFileFetchResult {
  const { exist, path, files, folders } = source;
  return {
    exist,
    path,
    files,
    folders: folders.map(i => readFilesResult(i))
  };
}
