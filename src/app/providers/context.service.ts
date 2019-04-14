import { Injectable } from "@angular/core";
import { CoreService } from "./core.service";
import { createRules, IDepts } from "./models/context.base";
import { DashboardActions as DASHBOARD } from "./models/dashbord.model";

@Injectable()
export class ContextService {
  private observables = createRules(
    {
      dashboard: DASHBOARD
    },
    () => <IDepts>{ core: this["core"] }
  );

  get dashboard() {
    return this.observables.dashboard;
  }

  constructor(private core: CoreService) {
    this.initServices();
  }

  private initServices() {
    Object.keys(this.observables).forEach(async (name: string) => {
      const actions = this.observables[name].actions;
      if (actions["init"] && typeof actions["init"] === "function") {
        actions.init();
      }
    });
  }
}
