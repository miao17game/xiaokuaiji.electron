import { Observable, BehaviorSubject } from "rxjs";
import { CoreService } from "../core.service";

interface IConstructor<T, D = any> {
  new (references: D): T;
}

interface IActionClass<T, D> {
  references: D;
}

export interface IEachSubject<T, A extends { [prop: string]: any }> {
  subject: BehaviorSubject<T>;
  actions: (subject: BehaviorSubject<T>, depts: any) => A;
}

type Return<T extends any> = T extends IConstructor<infer I>
  ? I extends Actions<infer ST, infer D>
    ? ST
    : unknown
  : unknown;

export type ObserverMap<T> = {
  [key in keyof T]: {
    observer: T[key] extends IEachSubject<infer S, infer A>
      ? Observable<S>
      : T[key] extends IConstructor<any>
      ? Observable<Return<T[key]>>
      : unknown;
    actions: T[key] extends IEachSubject<infer S, infer A>
      ? A
      : T[key] extends IConstructor<infer S, infer D>
      ? S
      : unknown;
  }
};

function resolveActions(source: IEachSubject<any, any> | IConstructor<any>, depts: any) {
  if (typeof source === "function") {
    const actions = new source(depts);
    return {
      observer: actions.subject.asObservable(),
      actions
    };
  } else {
    return {
      observer: source.subject.asObservable(),
      actions: source.actions(source.subject, depts)
    };
  }
}

export function createRules<T extends any, D extends IDepts = IDepts>(subjects: T, depts: () => D): ObserverMap<T> {
  const dependencies = depts();
  return <any>Object.keys(subjects)
    .map(<K extends keyof T>(k: K) => ({ [k]: resolveActions(subjects[k], dependencies) }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}

export interface IDepts {
  core: CoreService;
}

export abstract class Actions<T, D> implements IActionClass<any, any> {
  private _subjectKey!: string;
  private _subject!: BehaviorSubject<T>;
  private currentTick: Partial<T> = {};
  private currentTimer: number;

  protected get subject(): BehaviorSubject<T> {
    return this._subject || (this._subject = new BehaviorSubject(this[this._subjectKey]));
  }

  protected get last() {
    return this.subject.getValue();
  }

  constructor(public references: D) {
    this._subjectKey = this["@subjectKey"];
  }

  protected update(data: Partial<T> = {}) {
    clearTimeout(this.currentTimer);
    this.currentTick = {
      ...this.currentTick,
      ...data
    };
    this.currentTimer = setTimeout(() => {
      this.subject.next({
        ...this.last,
        ...this.currentTick
      });
      this.currentTick = {};
    });
  }
}

export function Behavior() {
  return function default_source<T extends Actions<any, any>>(prototype: T, propertyKay: string) {
    prototype["@subjectKey"] = propertyKay;
  };
}

export function SourceUpdate() {
  return function source_update<T extends Actions<any, any>>(
    prototype: T,
    propertyKay: string,
    descriptor: PropertyDescriptor
  ) {
    const source = descriptor.value;
    descriptor.value = async function(this: T, ...args: any[]) {
      await source.call(this, ...args);
      this["update"]();
    };
    Object.defineProperty(prototype, propertyKay, descriptor);
  };
}
