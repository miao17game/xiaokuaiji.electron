import { Component, OnInit } from "@angular/core";
import { ContextService } from "../../providers/context.service";
import { IFolderStruct } from "../../../../utils/metadata";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./style.scss"]
})
export class DashboardComponent implements OnInit {
  private get context() {
    return this.ctx.dashboard;
  }

  private get actions() {
    return this.context.actions;
  }

  public get dataAsync() {
    return this.context.observer;
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

  onFolderClick(folderRef: IFolderStruct) {
    if (!folderRef.loaded) {
      this.actions.loadPart(folderRef);
    }
  }
}
