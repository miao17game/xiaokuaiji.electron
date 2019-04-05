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

  private data: IFileFetchResult = {
    exist: true,
    path: "",
    files: [],
    folders: []
  };

  constructor(private electron: ElectronService) {}

  ngOnInit() {
    this.renderer.send(HOME_DIR_FILES_FETCH, { childPath: "Documents/需求" });
    this.renderer.on(HOME_DIR_FILES_FETCH, (_, { files }) => {
      this.data = files;
    });
  }

  onDragStart(event) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.renderer.removeAllListeners(HOME_DIR_FILES_FETCH);
  }
}
