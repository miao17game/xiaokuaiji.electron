import { Injectable } from "@angular/core";
import { Router, NavigationEnd, RouterState, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ElectronService } from "./electron.service";
import { ClientEvent } from "../../../utils/constants/events";

@Injectable()
export class CoreService {
  get ipc() {
    return this.electron.ipcRenderer;
  }

  constructor(private title: Title, private electron: ElectronService) {}

  public initRouter(router: Router, afterNavigate: (router: Router) => void) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join("-");
        this.title.setTitle(title);
        afterNavigate(router);
      }
    });
  }

  public debugToolSwitch() {
    this.ipc.send(ClientEvent.DebugMode, {});
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
