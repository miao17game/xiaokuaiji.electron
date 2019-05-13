import { Injectable } from "@angular/core";
import { Router, NavigationEnd, RouterState, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ElectronService } from "./electron.service";
import { ClientEvent } from "../../../utils/constants/events";
import { IFolderStruct, IPreferenceConfig, ICopyFileOptions } from "../../../utils/metadata";
import { IpcPromiseLoader, DefineValidate, Contract } from "../helpers/ipc-promise";

interface ICoreContract {
  debugToolSwitch(): void;
  dashboardInit(): Promise<void>;
  dashboardFetch(subPath?: string): Promise<IFolderStruct>;
  preferenceFetch(): Promise<IPreferenceConfig>;
  preferenceUpdate(configs: Partial<IPreferenceConfig>): Promise<void>;
}

@Injectable()
@DefineValidate(r => r === true)
export class CoreService extends IpcPromiseLoader<ICoreContract> implements ICoreContract {
  constructor(private title: Title, electron: ElectronService) {
    super(electron.ipcRenderer);
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

  @Contract(ClientEvent.DebugMode)
  public debugToolSwitch() {
    return this.sync();
  }

  @Contract(ClientEvent.InitAppFolder, {
    resolve: () => undefined
  })
  public dashboardInit() {
    return this.async();
  }

  @Contract(ClientEvent.FetchFiles, {
    resolve: ({ files }) => files,
    validate: () => true
  })
  public dashboardFetch(subPath?: string): Promise<IFolderStruct> {
    return this.async({ folderPath: subPath, showHideFiles: false, lazyLoad: true });
  }

  @Contract(ClientEvent.FetchPreferences, {
    resolve: ({ configs }) => configs,
    reject: ({ error }) => error,
    validate: ({ error }) => !error
  })
  public preferenceFetch(): Promise<IPreferenceConfig> {
    return this.async();
  }

  @Contract(ClientEvent.UpdatePreferences, {
    resolve: () => undefined
  })
  public preferenceUpdate(configs: Partial<IPreferenceConfig>): Promise<void> {
    return this.async(configs);
  }

  @Contract(ClientEvent.CopyFile)
  public copyFile(configs: ICopyFileOptions): Promise<boolean> {
    return this.async(configs);
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
