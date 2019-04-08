import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChildUrlPipe } from "./child-url.pipe";
import { UrlConnectPipe } from "./url.pipe";

@NgModule({
  declarations: [ChildUrlPipe, UrlConnectPipe],
  imports: [CommonModule],
  exports: [ChildUrlPipe, UrlConnectPipe],
  providers: []
})
export class PipesModule {}
