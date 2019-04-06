import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService } from "../../providers/electron.service";
import { ClientEvent } from "../../../../utils/constants/events";

@Component({
  selector: "app-preference",
  templateUrl: "./preference.html",
  styleUrls: ["./style.scss"]
})
export class PreferenceComponent implements OnInit, OnDestroy {
  public loading = true;
  public configs: any = {};

  private get ipc() {
    return this.electron.ipcRenderer;
  }

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.ipc.send(ClientEvent.FetchPreferences, {});
    this.ipc.on(ClientEvent.FetchPreferences, ({ error, configs }) => {
      if (error) {
        console.log(error);
      } else {
        this.configs = configs;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.ipc.removeAllListeners(ClientEvent.FetchPreferences);
  }
}
