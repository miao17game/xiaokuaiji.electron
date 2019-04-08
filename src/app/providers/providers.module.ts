import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";
import { CoreService } from "./core.service";
import { ConfigsService } from "./configs.service";
import { ContextService } from "./context.service";

@NgModule({
  providers: [CoreService, ElectronService, ConfigsService, HistoryService, ContextService]
})
export class ProvidersModule {}
