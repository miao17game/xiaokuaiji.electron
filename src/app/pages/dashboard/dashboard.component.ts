import { Component, OnInit } from "@angular/core";
import { ContextService } from "../../providers/context.service";

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

  public loading = false;

  constructor(private ctx: ContextService) {}

  ngOnInit() {}

  async onRefresh() {
    this.loading = true;
    this.actions.referesh(() => (this.loading = false));
  }

  async initRootFolder() {
    this.actions.init(() => this.onRefresh());
  }

  onFileSelect(path: string) {
    console.log(path);
  }
}
