import { Component, OnInit } from "@angular/core";
import { ConfigsService } from "../../providers/configs.service";

@Component({
  selector: "app-preference",
  templateUrl: "./preference.html",
  styleUrls: ["./style.scss"]
})
export class PreferenceComponent implements OnInit {
  get loading() {
    return !this.conf.configs.init;
  }

  get configs() {
    return this.conf.configs;
  }

  constructor(private conf: ConfigsService) {}

  ngOnInit() {
    if (!this.configs.init) {
      this.conf.loadConfigs();
    }
  }

  onDarkModeChange(value: boolean) {
    this.configs.darkMode = value;
    this.conf.updateConfigs();
  }
}
