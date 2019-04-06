import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { IFileFetchResult } from "../../../../utils/works/client";

interface IViewContext {
  exist: boolean;
  path: string;
  files: string[];
  folders: IViewContext[];
  expanded?: boolean;
}

@Component({
  selector: "folder-list",
  templateUrl: "./folder-list.html",
  styleUrls: ["./style.scss"]
})
export class FolderListComponent implements OnInit, OnChanges {
  @Input() context: IFileFetchResult;

  private viewContext: IViewContext = {
    exist: false,
    path: "",
    files: [],
    folders: [],
    expanded: false
  };

  get reference() {
    return this.viewContext || { exist: false };
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    for (const key in changes) {
      if (key === "context") {
        this.viewContext = changes[key].currentValue;
      }
    }
  }

  public onExpanded(folder: IViewContext) {
    folder.expanded = !folder.expanded;
  }
}
