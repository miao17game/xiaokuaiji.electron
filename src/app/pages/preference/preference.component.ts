import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService } from "../../providers/electron.service";
import { ClientEvent } from "../../../../utils/constants/events";
import { IPreferenceConfig } from "../../../../utils/metadata";

@Component({
  selector: "app-preference",
  templateUrl: "./preference.html",
  styleUrls: ["./style.scss"]
})
export class PreferenceComponent implements OnInit, OnDestroy {
  public loading = true;
  public configs: IPreferenceConfig = {};

  private get ipc() {
    return this.electron.ipcRenderer;
  }

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.ipc.send(ClientEvent.FetchPreferences, {});
    this.ipc.on(ClientEvent.FetchPreferences, (_: any, { configs }) => {
      this.configs = configs;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.ipc.removeAllListeners(ClientEvent.FetchPreferences);
  }
}
