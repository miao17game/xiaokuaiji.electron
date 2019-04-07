import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";

const routes = {
  home: "首页",
  dashboard: "工作台",
  preference: "偏好设置"
};

const actions = {};

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = false;
  public showMsg = true;
  public urls: [string, string][] = buildRoutes(routes);

  public get canGoBack() {
    return this.history.canBack;
  }

  public get canGoForward() {
    return this.history.canForward;
  }

  constructor(private router: Router, private history: HistoryService, private core: CoreService) {
    this.core.initRouter(router, this.history.decide.bind(this.history));
  }

  ngOnInit() {}

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  onMessageBarClick() {
    this.showMsg = !this.showMsg;
  }

  onBackClick() {
    const url = this.history.getBack();
    this.router.navigateByUrl(url);
  }

  onForwardClick() {
    const url = this.history.getForward();
    this.router.navigateByUrl(url);
  }

  onDebugClick() {
    this.core.debugToolSwitch();
  }

  onSettingsClick() {
    this.router.navigateByUrl("/preference");
  }
}

function buildRoutes(routes: { [key: string]: string }): [string, string][] {
  return Object.keys(routes).map<[string, string]>(k => [`/${k}`, routes[k]]);
}
