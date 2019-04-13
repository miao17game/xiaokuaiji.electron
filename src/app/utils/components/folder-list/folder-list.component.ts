import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ContentChild, TemplateRef } from "@angular/core";
import { IFolderStruct } from "../../../../../utils/metadata";

interface IViewContext {
  loaded: boolean;
  exist: boolean;
  path: string;
  files: string[];
  folders: IViewContext[];
  expanded?: boolean;
  isRoot?: boolean;
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
    loaded: false,
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
        this.viewContext.loaded = true;
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
  return source;
}

function readFilesResult(source: IViewContext): IFolderStruct {
  return source;
}
