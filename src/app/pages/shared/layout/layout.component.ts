import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd, RouterState } from "@angular/router";
import { Location as LocationService } from "@angular/common";
import { ElectronService } from "../../../providers/electron.service";
import { ClientEvent } from "../../../../../utils/constants/events";
import { Title } from "@angular/platform-browser";
import { HistoryService } from "../../../providers/history.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  private goBacking = false;

  public showMenu = false;
  public showMsg = true;
  public urls: [string, string][] = [["/home", "首页"], ["/dashboard", "工作台"], ["/preference", "偏好设置"]];

  public get currentUrl() {
    return this.route.url;
  }

  public get canGoBack() {
    return this.trip.deepth > 0;
  }

  private get renderer() {
    return this.electron.ipcRenderer;
  }

  constructor(
    private location: LocationService,
    private router: Router,
    private title: Title,
    private route: ActivatedRoute,
    private electron: ElectronService,
    private trip: HistoryService
  ) {
    this.initRouteSubps();
  }

  ngOnInit() {}

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  onMessageBarClick() {
    this.showMsg = !this.showMsg;
  }

  onBackClick() {
    const url = this.trip.pop();
    this.goBacking = true;
    this.router.navigateByUrl(url);
  }

  onDebugClick() {
    this.renderer.send(ClientEvent.DebugMode, {});
  }

  onSettingsClick() {
    this.router.navigateByUrl("/preference");
  }

  private initRouteSubps() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join("-");
        this.title.setTitle(title);
        if (this.goBacking) {
          this.goBacking = false;
        } else {
          this.trip.push(this.router.url);
        }
      }
    });
  }

  private getTitle(state: RouterState, parent: ActivatedRoute) {
    const data: string[] = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      data.push(...this.getTitle(state, state["firstChild"](parent)));
    }
    return data;
  }
}
