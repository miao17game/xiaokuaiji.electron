import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DefaultValueDirective } from "./default-content.directive";
import { IconDirective } from "./icon.directive";
import { WebviewDirective } from "./webview.directive";

@NgModule({
  declarations: [DefaultValueDirective, IconDirective, WebviewDirective],
  imports: [CommonModule],
  exports: [DefaultValueDirective, IconDirective, WebviewDirective],
  providers: []
})
export class DirectivesModule {}
