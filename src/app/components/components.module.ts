import { NgModule } from "@angular/core";
import { WebviewDirective } from "./webview.directive";
import { UrlConnectPipe } from "./url.pipe";

@NgModule({
  declarations: [WebviewDirective, UrlConnectPipe],
  exports: [WebviewDirective, UrlConnectPipe]
})
export class ComponentsModule {}
