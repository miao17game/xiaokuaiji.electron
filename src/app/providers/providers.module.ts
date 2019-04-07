import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";
import { CoreService } from "./core.service";
import { ConfigsService } from "./configs.service";

@NgModule({
  providers: [CoreService, ElectronService, ConfigsService, HistoryService]
})
export class ProvidersModule {}
