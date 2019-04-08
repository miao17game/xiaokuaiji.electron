import { Component } from "@angular/core";
import { ElectronService } from "../providers/electron.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../environments/environment";

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(public electronService: ElectronService, private translate: TranslateService) {
    translate.setDefaultLang("en");
    console.log("AppConfig", AppConfig);

    if (electronService.appMode) {
      console.log("Mode electron");
    } else {
      console.log("Mode web");
    }
  }
}
