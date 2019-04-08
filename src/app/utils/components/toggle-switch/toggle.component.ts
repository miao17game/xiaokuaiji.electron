import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "toggle-switch",
  templateUrl: "./toggle.html",
  styleUrls: ["./style.scss"]
})
export class ToggleSwitchComponent implements OnInit {
  @Input() checked: boolean | string = false;
  @Input() size: "large" | "small" | "normal" = "normal";

  get css() {
    return {
      [`toggle-${this.size}`]: true
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
