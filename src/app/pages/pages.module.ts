import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LayoutComponent } from "./shared/layout/layout.component";
import { ComponentsModule } from "../utils/components/components.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PreferenceComponent } from "./preference/preference.component";
import { UserCenterComponent } from "./user-center/user.component";

@NgModule({
  declarations: [LayoutComponent, HomeComponent, DashboardComponent, PreferenceComponent, UserCenterComponent],
  imports: [RouterModule, CommonModule, ComponentsModule]
})
export class PagesModule {}
