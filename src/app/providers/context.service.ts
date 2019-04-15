import { Injectable } from "@angular/core";
import { ContextCenter } from "../helpers/context";
import { CoreService } from "./core.service";
import { DashboardContext as DASHBOARD } from "../models/dashbord.model";
import { PreferenceContext as PREFERENCE } from "../models/preference.model";

const observers = { dashboard: DASHBOARD, preference: PREFERENCE };

@Injectable()
export class ContextService extends ContextCenter<typeof observers> {
  constructor(core: CoreService) {
    super();
    this.createRules(observers);
    this.inject(CoreService, () => core);
    this.finalize();
  }
}
