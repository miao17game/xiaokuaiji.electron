import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.html",
  styleUrls: ["./style.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onCLick() {
    console.log(this.router);
    this.router.navigateByUrl("/dashboard");
  }
}
