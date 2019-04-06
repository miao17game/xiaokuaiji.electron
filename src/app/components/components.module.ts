import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WebviewDirective } from "./webview.directive";
import { UrlConnectPipe } from "./url.pipe";
import { NormalizedButtonComponent } from "./normalized-btn/btn.component";
import { FolderListComponent } from "./folder-list/folder-list.component";

@NgModule({
  declarations: [WebviewDirective, UrlConnectPipe, NormalizedButtonComponent, FolderListComponent],
  imports: [CommonModule],
  exports: [WebviewDirective, UrlConnectPipe, NormalizedButtonComponent, FolderListComponent]
})
export class ComponentsModule {}
