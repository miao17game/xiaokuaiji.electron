import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";

@NgModule({
  providers: [ElectronService, HistoryService]
})
export class ProvidersModule {}
