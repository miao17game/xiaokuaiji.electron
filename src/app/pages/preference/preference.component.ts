import { Component, OnInit } from "@angular/core";
import { ContextService } from "../../providers/context.service";

@Component({
  selector: "app-preference",
  templateUrl: "./preference.html",
  styleUrls: ["./style.scss"]
})
export class PreferenceComponent implements OnInit {
  get dataAsync() {
    return this.context.datasets.preference;
  }

  get actions() {
    return this.context.actions.preference;
  }

  constructor(private context: ContextService) {}

  ngOnInit() {}

  onDarkModeChange(value: boolean) {
    this.actions.updateConfigs({ darkMode: value });
  }
}
