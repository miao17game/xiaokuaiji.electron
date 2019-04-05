import { NgModule } from "@angular/core";
import { WebviewDirective } from "./webview.directive";
import { UrlConnectPipe } from "./url.pipe";
import { NormalizedButtonComponent } from "./normalized-btn/btn.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [WebviewDirective, UrlConnectPipe, NormalizedButtonComponent],
  imports: [CommonModule],
  exports: [WebviewDirective, UrlConnectPipe, NormalizedButtonComponent]
})
export class ComponentsModule {}
