import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService } from "../../providers/electron.service";
import { HOME_DIR_FILES_FETCH } from "../../../../utils/constants/events";
import { IFileFetchResult } from "../../../../utils/works/client";

@Component({
  selector: "app-main",
  templateUrl: "./main.html",
  styleUrls: ["./style.scss"]
})
export class MainComponent implements OnInit, OnDestroy {
  private get renderer() {
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
    this.renderer.send(HOME_DIR_FILES_FETCH, {});
    this.renderer.on(HOME_DIR_FILES_FETCH, (_: any, { files }: { files: IFileFetchResult }) => {
      this.data = files;
      this.loading = false;
    });
  }

  onRefresh() {
    this.loading = true;
    this.renderer.send(HOME_DIR_FILES_FETCH, {});
  }

  ngOnDestroy(): void {
    this.renderer.removeAllListeners(HOME_DIR_FILES_FETCH);
  }
}
