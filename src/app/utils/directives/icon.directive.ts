import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "icon"
})
export class IconDirective implements OnInit {
  @Input() type: string;
  @Input() class: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.className = `fa fa-${this.type} ${this.class || ""}`;
  }
}
