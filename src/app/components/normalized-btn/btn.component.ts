import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";

@Component({
  selector: "normalized-button",
  templateUrl: "./button.html",
  styleUrls: ["./style.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NormalizedButtonComponent implements OnInit {
  @Input() type: "primary" | "default" = "default";

  constructor() {}

  ngOnInit(): void {}
}
