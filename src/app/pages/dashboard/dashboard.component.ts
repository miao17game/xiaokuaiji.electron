import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService } from "../../providers/electron.service";
import { ClientEvent } from "../../../../utils/constants/events";
import { IFolderStruct } from "../../../../utils/metadata";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./style.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private get ipc() {
    return this.electron.ipcRenderer;
  }

  public data: IFolderStruct = {
    exist: true,
    path: "",
    files: [],
    folders: []
  };

  public loading = true;

  constructor(private electron: ElectronService) {}

  ngOnInit() {
    this.ipc.send(ClientEvent.FetchFiles, { showHideFiles: false });
    this.ipc.on(ClientEvent.FetchFiles, (_: any, { files }: { files: IFolderStruct }) => {
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
