import { Component, OnInit } from "@angular/core";
import { IFolderStruct } from "../../../../utils/metadata";
import { CoreService } from "../../providers/core.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./style.scss"]
})
export class DashboardComponent implements OnInit {
  public data: IFolderStruct = {
    exist: true,
    path: "",
    files: [],
    folders: []
  };

  public loading = true;

  constructor(private core: CoreService) {}

  ngOnInit() {
    this.onRefresh();
  }

  async onRefresh() {
    this.loading = true;
    const files = await this.core.dashboardFetch();
    this.data = files;
    this.loading = false;
  }

  async initRootFolder() {
    await this.core.dashboardInit();
    this.onRefresh();
  }

  onFileSelect(path: string) {
    console.log(path);
  }
}
