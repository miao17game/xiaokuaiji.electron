import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";
import { CoreService } from "./core.service";
import { ContextService } from "./context.service";

@NgModule({
  providers: [CoreService, ElectronService, HistoryService, ContextService]
})
export class ProvidersModule {}
