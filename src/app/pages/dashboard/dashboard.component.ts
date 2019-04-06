import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService } from "../../providers/electron.service";
import { ClientEvent } from "../../../../utils/constants/events";
import { IFileFetchResult } from "../../../../utils/works/client";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./style.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private get ipc() {
    return this.electron.ipcRenderer;
  }

  public data: IFileFetchResult = {
    exist: true,
    path: "",
    files: [],
    folders: []
  };

  public loading = true;

  constructor(private electron: ElectronService) {}

  ngOnInit() {
    this.ipc.send(ClientEvent.FetchFiles, {});
    this.ipc.on(ClientEvent.FetchFiles, (_: any, { files }: { files: IFileFetchResult }) => {
      this.data = files;
      this.loading = false;
    });
  }

  onRefresh() {
    this.loading = true;
    this.ipc.send(ClientEvent.FetchFiles, {});
  }

  initRootFolder() {
    this.ipc.send(ClientEvent.InitAppFolder, {});
    this.ipc.on(ClientEvent.InitAppFolder, () => {
      this.onRefresh();
    });
  }

  onFileSelect(path: string) {
    console.log(path);
  }

  ngOnDestroy(): void {
    this.ipc.removeAllListeners(ClientEvent.FetchFiles);
    this.ipc.removeAllListeners(ClientEvent.InitAppFolder);
  }
}
