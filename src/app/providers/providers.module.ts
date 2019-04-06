import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";
import { CoreService } from "./core.service";

@NgModule({
  providers: [CoreService, ElectronService, HistoryService]
})
export class ProvidersModule {}
