import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location as LocationService } from "@angular/common";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = true;
  public urls: [string, string][] = [["/home", "首页"], ["/main", "主页面"]];

  public get currentUrl() {
    return this.route.url;
  }

  public get canGoBack() {
    return !!(history && history.length > 1);
  }

  constructor(private location: LocationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(history);
  }

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  onBackClick() {
    this.location.back();
  }
}
