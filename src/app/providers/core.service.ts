import { Injectable } from "@angular/core";
import { Router, NavigationEnd, RouterState, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ElectronService } from "./electron.service";
import { ClientEvent } from "../../../utils/constants/events";
import { IFolderStruct, IPreferenceConfig } from "../../../utils/metadata";
import { IpcPromiseLoader, DefineResolve, DefineValidate, DefineReject } from "../helpers/ipc-promise";

interface ICoreContract {
  debugToolSwitch(): void;
  dashboardInit(): Promise<void>;
  dashboardFetch(subPath?: string): Promise<IFolderStruct>;
  preferenceFetch(): Promise<IPreferenceConfig>;
  preferenceUpdate(configs: Partial<IPreferenceConfig>): Promise<void>;
}

@Injectable()
export class CoreService extends IpcPromiseLoader<ICoreContract> implements ICoreContract {
  constructor(private title: Title, electron: ElectronService) {
    super(electron.ipcRenderer);
    this.register(ClientEvent.DebugMode, "debugToolSwitch");
    this.register(ClientEvent.InitAppFolder, "dashboardInit");
    this.register(ClientEvent.FetchFiles, "dashboardFetch");
    this.register(ClientEvent.FetchPreferences, "preferenceFetch");
    this.register(ClientEvent.UpdatePreferences, "preferenceUpdate");
  }

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
    return this.send();
  }

  @DefineResolve(() => undefined)
  @DefineValidate(r => r === true)
  public dashboardInit() {
    return this.promise();
  }

  @DefineResolve(({ files }) => files)
  @DefineValidate(() => true)
  public dashboardFetch(subPath?: string): Promise<IFolderStruct> {
    return this.promise({ folderPath: subPath, showHideFiles: false, lazyLoad: true });
  }

  @DefineResolve(({ configs }) => configs)
  @DefineReject(({ error }) => error)
  @DefineValidate(({ error }) => !error)
  public preferenceFetch(): Promise<IPreferenceConfig> {
    return this.promise();
  }

  @DefineResolve(() => undefined)
  @DefineValidate(r => r === true)
  public preferenceUpdate(configs: Partial<IPreferenceConfig>): Promise<void> {
    return this.promise(configs);
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
