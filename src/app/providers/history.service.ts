import { Injectable } from "@angular/core";

@Injectable()
export class HistoryService {
  private stack: string[] = [];
  private _cur: string;

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
    return pop;
  }
}
