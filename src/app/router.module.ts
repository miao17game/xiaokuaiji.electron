import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./pages/main/main.component";
import { LayoutComponent } from "./pages/shared/layout/layout.component";

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
        component: HomeComponent
      },
      {
        path: "main",
        component: MainComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
