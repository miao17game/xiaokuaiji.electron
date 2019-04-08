import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";
import { FolderListComponent } from "./folder-list/folder-list.component";
import { NormalizedButtonComponent } from "./normalized-btn/btn.component";
import { LoadingComponent } from "./loading/loading.component";
import { ToggleSwitchComponent } from "./toggle-switch/toggle.component";

@NgModule({
  declarations: [LoadingComponent, FolderListComponent, NormalizedButtonComponent, ToggleSwitchComponent],
  imports: [CommonModule, FormsModule, DirectivesModule, PipesModule],
  exports: [
    DirectivesModule,
    PipesModule,
    LoadingComponent,
    FolderListComponent,
    NormalizedButtonComponent,
    ToggleSwitchComponent
  ]
})
export class ComponentsModule {}
