import { Injectable } from "@angular/core";
import { CoreService } from "./core.service";
import { IPreferenceConfig } from "../../../utils/metadata";

interface IConfigs extends IPreferenceConfig {
  init: boolean;
}

@Injectable()
export class ConfigsService {
  private _globalConfigs: IConfigs;

  get configs(): IConfigs {
    return this._globalConfigs || { init: false };
  }

  constructor(private readonly core: CoreService) {
    this.loadConfigs();
  }

  public async loadConfigs() {
    try {
      this._globalConfigs = undefined;
      const result = await this.core.preferenceFetch();
      this._globalConfigs = { ...result, init: true };
    } catch (error) {
      console.log(error);
    }
  }
}
