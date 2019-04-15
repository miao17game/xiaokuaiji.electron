import { Actions, Context } from "../helpers/context";
import { IPreferenceConfig } from "../../../utils/metadata";
import { CoreService } from "../providers/core.service";

interface IPreferenceState extends IPreferenceConfig {
  init: boolean;
}

const defaultConfigs: IPreferenceState = {
  init: false,
  updateAt: 0,
  darkMode: false
};

@Context()
export class PreferenceContext extends Actions<IPreferenceState> {
  protected readonly initial: IPreferenceState = defaultConfigs;

  constructor(private core: CoreService) {
    super();
  }

  public async init() {
    try {
      this.update({ init: false });
      const result = await this.core.preferenceFetch();
      this.update(result);
      this.update({ init: true });
    } catch (error) {
      console.log(error);
    }
  }

  public async updateConfigs(updates: Partial<IPreferenceConfig>) {
    try {
      await this.core.preferenceUpdate(updates);
      this.init();
    } catch (error) {
      console.log(error);
    }
  }
}
