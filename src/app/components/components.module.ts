import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WebviewDirective } from "./webview.directive";
import { UrlConnectPipe } from "./url.pipe";
import { NormalizedButtonComponent } from "./normalized-btn/btn.component";
import { FolderListComponent } from "./folder-list/folder-list.component";
import { LoadingComponent } from "./loading/loading.component";
import { ChildUrlPipe } from "./child-url.pipe";
import { IconDirective } from "./icon.directive";
import { DefaultValueDirective } from "./default-content.directive";

@NgModule({
  declarations: [
    WebviewDirective,
    IconDirective,
    DefaultValueDirective,
    UrlConnectPipe,
    ChildUrlPipe,
    NormalizedButtonComponent,
    FolderListComponent,
    LoadingComponent
  ],
  imports: [CommonModule],
  exports: [
    WebviewDirective,
    IconDirective,
    DefaultValueDirective,
    UrlConnectPipe,
    ChildUrlPipe,
    NormalizedButtonComponent,
    FolderListComponent,
    LoadingComponent
  ]
})
export class ComponentsModule {}
