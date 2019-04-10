import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = false;
  public showMsg = true;
  public urls = buildRoutes();
  public actions = buildActions(this);

  public get currentPath() {
    return this.router.url;
  }

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

  onUserCenterClick() {
    this.router.navigateByUrl("/usercenter");
  }
}

function buildActions(target: LayoutComponent) {
  const actions = {
    debug: {
      type: "plug",
      class: "icon-size-16",
      onclick: target.onDebugClick.bind(target)
    },
    usercenter: {
      type: "user-circle",
      class: "icon-size-17",
      onclick: target.onUserCenterClick.bind(target)
    },
    settings: {
      type: "cog",
      class: "icon-size-19",
      onclick: target.onSettingsClick.bind(target)
    },
    message: {
      type: "comments",
      class: "icon-size-19",
      onclick: target.onMessageBarClick.bind(target)
    },
    menu: {
      type: "navicon",
      class: "icon-size-18",
      onclick: target.onMenuClick.bind(target)
    }
  };
  return Object.keys(actions).map(k => actions[k]);
}

const routes = {
  home: "首页",
  dashboard: "工作台",
  preference: "偏好设置"
};

function buildRoutes(): [string, string][] {
  return Object.keys(routes).map<[string, string]>(k => [`/${k}`, routes[k]]);
}
