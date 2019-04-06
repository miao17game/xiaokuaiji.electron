import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class HistoryService {
  private stack: string[] = [];
  private _cur: string;
  private _isbacking = false;

  get current() {
    return this._cur;
  }

  get deepth() {
    return this.stack.length;
  }

  push(path: string) {
    if (this._cur) {
      this.stack.push(this._cur);
    }
    this._cur = path;
  }

  pop() {
    const pop = this.stack.pop();
    this._cur = pop;
    this._isbacking = true;
    return pop;
  }

  decide(router: Router) {
    if (this._isbacking) {
      this._isbacking = false;
    } else {
      this.push(router.url);
    }
  }
}
