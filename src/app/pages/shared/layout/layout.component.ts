import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, UrlSegment } from "@angular/router";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = true;

  public get currentUrl() {
    return this.route.url;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }
}
