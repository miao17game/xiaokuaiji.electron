import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";
import { FolderListComponent } from "./folder-list/folder-list.component";
import { NormalizedButtonComponent } from "./normalized-btn/btn.component";
import { LoadingComponent } from "./loading/loading.component";

@NgModule({
  declarations: [LoadingComponent, FolderListComponent, NormalizedButtonComponent],
  imports: [CommonModule, DirectivesModule, PipesModule],
  exports: [DirectivesModule, PipesModule, LoadingComponent, FolderListComponent, NormalizedButtonComponent]
})
export class ComponentsModule {}
