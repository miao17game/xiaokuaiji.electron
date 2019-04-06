import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LayoutComponent } from "./pages/shared/layout/layout.component";
import { PreferenceComponent } from "./pages/preference/preference.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home"
      },
      {
        path: "home",
        component: HomeComponent,
        data: { title: "首页" }
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        data: { title: "操作台" }
      },
      {
        path: "preference",
        component: PreferenceComponent,
        data: { title: "偏好设置" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
