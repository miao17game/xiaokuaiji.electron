import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ContentChild, TemplateRef } from "@angular/core";
import { IFolderStruct } from "../../../../../utils/metadata";
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
  @Input() context: IFolderStruct;
  @Output() onFolderClick = new EventEmitter<IFolderStruct>();
  @Output() onFileClick = new EventEmitter<string>();

  @ContentChild("fileContext") fileContext: TemplateRef<any>;
  @ContentChild("folderTitle") folderTitle: TemplateRef<any>;
  @ContentChild("folderHeader") folderHeader: TemplateRef<any>;

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

  constructor() {
    this.onExpanded = this.onExpanded.bind(this);
    this.onFileTapped = this.onFileTapped.bind(this);
  }

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

function buildViewContext(source: IFolderStruct): IViewContext {
  return {
    exist: source.exist,
    path: source.path,
    files: source.files || [],
    folders: (source.folders || []).map(i => buildViewContext(i)),
    expanded: false,
    isRoot: false
  };
}

function readFilesResult(source: IViewContext): IFolderStruct {
  const { exist, path, files, folders } = source;
  return {
    exist,
    path,
    files,
    folders: folders.map(i => readFilesResult(i))
  };
}
