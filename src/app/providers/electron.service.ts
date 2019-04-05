import { Injectable, NgZone } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor(private ngZone: NgZone) {
    if (this.isElectron()) {
      this.heckIpcRendererWithNgZOne();
      this.webFrame = window.require("electron").webFrame;
      this.remote = window.require("electron").remote;
      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  private heckIpcRendererWithNgZOne() {
    const { ngZone } = this;
    const ipcRenderer = window.require("electron").ipcRenderer;
    this.ipcRenderer = new Proxy(ipcRenderer, {
      get(target, name) {
        if (name === "on" || name === "once") {
          return (key: string, handler: Function) =>
            target[name](key, handler && ((...args: any[]) => ngZone.run(() => handler(...args))));
        }
        return target[name];
      }
    });
  }
}
