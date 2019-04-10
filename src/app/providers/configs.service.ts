import { Injectable } from "@angular/core";
import { CoreService } from "./core.service";
import { IPreferenceConfig } from "../../../utils/metadata";

interface IConfigs extends IPreferenceConfig {
  init: boolean;
}

const defaultConfigs: IConfigs = {
  init: false,
  updateAt: 0,
  darkMode: false
};

@Injectable()
export class ConfigsService {
  private _globalConfigs: IConfigs = { ...defaultConfigs };

  get configs(): IConfigs {
    return this._globalConfigs;
  }

  constructor(private readonly core: CoreService) {
    this.loadConfigs();
  }

  public async loadConfigs() {
    try {
      const result = await this.core.preferenceFetch();
      this._globalConfigs = { ...this._globalConfigs, ...result, init: true };
    } catch (error) {
      console.log(error);
    }
  }

  public async updateConfigs() {
    try {
      const { init: _, ...otherConfigs } = this.configs;
      await this.core.preferenceUpdate(otherConfigs);
      this.loadConfigs();
    } catch (error) {
      console.log(error);
    }
  }
}
