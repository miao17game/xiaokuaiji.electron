import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "toggle-switch",
  templateUrl: "./toggle.html",
  styleUrls: ["./style.scss"]
})
export class ToggleSwitchComponent implements OnInit {
  @Input() size: "large" | "big" | "small" | "normal" = "normal";
  @Input() checked: boolean = false;
  @Input() disabled: boolean;
  @Output() onChange = new EventEmitter<boolean>();

  get css() {
    return {
      [`toggle-${this.size}`]: true
    };
  }

  constructor() {}

  ngOnInit(): void {}

  onValueChange(e: any) {
    this.onChange.emit(e.target.checked);
  }
}
