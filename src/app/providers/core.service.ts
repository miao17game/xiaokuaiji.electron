import { Injectable } from "@angular/core";
import { Router, NavigationEnd, RouterState, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ElectronService } from "./electron.service";
import { ClientEvent } from "../../../utils/constants/events";
import { IFolderStruct, IPreferenceConfig } from "../../../utils/metadata";

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

  public dashboardInit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ipc.once(ClientEvent.InitAppFolder, (_: any, result) => {
        if (result === true) {
          resolve();
        } else {
          reject(result);
        }
      });
      this.ipc.send(ClientEvent.InitAppFolder, {});
    });
  }

  public dashboardFetch(subPath?: string): Promise<IFolderStruct> {
    return new Promise<IFolderStruct>((resolve, reject) => {
      this.ipc.once(ClientEvent.FetchFiles, (_: any, result: { files: IFolderStruct }) => resolve(result.files));
      this.ipc.send(ClientEvent.FetchFiles, { folderPath: subPath, showHideFiles: false, lazyLoad: true });
    });
  }

  public preferenceFetch(): Promise<IPreferenceConfig> {
    return new Promise((resolve, reject) => {
      this.ipc.once(ClientEvent.FetchPreferences, (_: any, { configs, error }) => {
        if (error) {
          reject(error);
        } else {
          resolve(configs);
        }
      });
      this.ipc.send(ClientEvent.FetchPreferences, {});
    });
  }

  public preferenceUpdate(configs: Partial<IPreferenceConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ipc.once(ClientEvent.UpdatePreferences, (_: any, result) => {
        if (result === true) {
          resolve();
        } else {
          reject(result);
        }
      });
      this.ipc.send(ClientEvent.UpdatePreferences, { configs });
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
