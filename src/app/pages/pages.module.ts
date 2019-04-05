import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { MainComponent } from "./main/main.component";
import { LayoutComponent } from "./shared/layout/layout.component";
import { ComponentsModule } from "../components/components.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [LayoutComponent, HomeComponent, MainComponent],
  imports: [RouterModule, CommonModule, ComponentsModule]
})
export class PagesModule {}
