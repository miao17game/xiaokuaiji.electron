import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class HistoryService {
  private stack: string[] = [];
  private index: number = 0;
  private prevent = false;

  get current() {
    return this.stack[this.index];
  }

  get deepth() {
    return this.stack.length;
  }

  get canBack() {
    return this.deepth > 1 && this.index > 1;
  }

  get canForward() {
    return this.index < this.stack.length;
  }

  push(path: string) {
    if (this.canForward) {
      this.stack = this.stack.slice(0, this.index);
      this.stack.push(path);
      this.index = this.stack.length;
    } else {
      this.stack.push(path);
      this.index = this.stack.length;
    }
  }

  getBack() {
    if (this.canBack) {
      this.index = this.index - 1;
      const pop = this.stack[this.index - 1];
      this.prevent = true;
      return pop;
    } else {
      throw new Error("history stack is empty.");
    }
  }

  getForward() {
    if (this.canForward) {
      this.index = this.index + 1;
      const pop = this.stack[this.index - 1];
      this.prevent = true;
      return pop;
    } else {
      throw new Error("history stack is full.");
    }
  }

  decide(router: Router) {
    if (this.prevent) {
      this.prevent = false;
    } else {
      this.push(router.url);
    }
  }
}
