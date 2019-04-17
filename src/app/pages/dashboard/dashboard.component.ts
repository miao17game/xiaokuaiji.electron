import { Component, OnInit } from "@angular/core";
import { ContextService } from "../../providers/context.service";
import { IFolderStruct } from "../../../../utils/metadata";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./style.scss"]
})
export class DashboardComponent implements OnInit {
  private get actions() {
    return this.ctx.actions.dashboard;
  }

  public get dataAsync() {
    return this.ctx.datasets.dashboard;
  }

  constructor(private ctx: ContextService) {}

  ngOnInit() {}

  async onRefresh() {
    this.actions.resetLoading(true);
    await this.actions.referesh();
    setTimeout(() => {
      this.actions.resetLoading(false);
    }, 500);
  }

  async initRootFolder() {
    await this.actions.initAppRoot();
    this.onRefresh();
  }

  onFileSelect(path: string) {
    console.log(path);
  }

  async onFileChanged(event: Event, path) {
    const sourcePath = ((<any>event.target).files as File[])[0].path;
    console.log(event, path);
    await this.actions.copyFileToFolder(sourcePath, path);
    this.onRefresh();
  }

  onFolderClick(folderRef: IFolderStruct) {
    if (!folderRef.loaded) {
      this.actions.loadPart(folderRef);
    }
  }
}
