import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "normalized-button",
  templateUrl: "./button.html",
  styleUrls: ["./style.scss"]
})
export class NormalizedButtonComponent implements OnInit {
  @Input() type: "primary" | "default" = "default";
  @Input() size: "normal" | "small" | "large" = "normal";
  @Input() circle: boolean;
  @Input() outline: boolean;

  get btnCss() {
    const type = this.type || "default";
    const size = `size-${this.size || "normal"}`;
    const csses = {
      [type]: true,
      [size]: true
    };
    if (this.outline) {
      csses[`${type}-outline`] = true;
    }
    if (this.circle) {
      csses["btn-circle"] = true;
    }
    return csses;
  }

  constructor() {}

  ngOnInit(): void {}
}
