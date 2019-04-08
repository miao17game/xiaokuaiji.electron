import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "loading",
  templateUrl: "./loading.html",
  styleUrls: ["./style.scss"]
})
export class LoadingComponent implements OnInit {
  @Input() show: boolean;

  constructor() {}

  ngOnInit(): void {}
}
