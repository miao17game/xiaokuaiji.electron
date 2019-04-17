import { Observable, BehaviorSubject } from "rxjs";

interface IConstructor<T> {
  new (...args: any[]): T;
}

export interface IEachSubject<T, A extends { [prop: string]: any }> {
  subject: BehaviorSubject<T>;
  actions: (subject: BehaviorSubject<T>, injector: { get<K>(key: IConstructor<K>): any }) => A;
}

type ExtractState<T extends any> = T extends IConstructor<infer I>
  ? I extends Actions<infer ST>
    ? ST
    : unknown
  : unknown;

type ExtractObserver<T> = T extends IEachSubject<infer S, infer A>
  ? Observable<S>
  : T extends IConstructor<any>
  ? Observable<ExtractState<T>>
  : unknown;

type ExtractAction<T> = T extends IEachSubject<infer S, infer A> ? A : T extends IConstructor<infer S> ? S : unknown;

export type ObserverMap<T> = { [key in keyof T]: ExtractObserver<T[key]> };
export type ActionMap<T> = { [key in keyof T]: ExtractAction<T[key]> };
export type ContextMap<T> = {
  [key in keyof T]: {
    observer: ExtractObserver<T[key]>;
    actions: ExtractAction<T[key]>;
  }
};

function resolveActions(source: IEachSubject<any, any> | IConstructor<Actions<any>>, injector: any) {
  if (typeof source === "function") {
    const types: any[] = Reflect.getMetadata("design:paramtypes", source) || [];
    const actions = new source(...types.map(type => injector.get(type)));
    return {
      observer: actions["subject"].asObservable(),
      actions
    };
  } else {
    return {
      observer: source.subject.asObservable(),
      actions: source.actions(source.subject, injector)
    };
  }
}

interface IContextRules<T> {
  inject<TYPE>(type: IConstructor<TYPE>, value: () => TYPE): IContextRules<T>;
  create(): ContextMap<T>;
}

function createRules<T extends any>(subjects: T): IContextRules<T> {
  const dependencies = new Map();
  function get(this: Map<any, any>, key: any) {
    const result = this.get(key);
    if (!result) throw new Error(`injection resolve failed : ${(key && key["name"]) || "[unknown token]"}`);
    return result;
  }
  const injector = new Proxy(dependencies, {
    get(target, key) {
      if (key !== "get") return target[key];
      return get.bind(target);
    }
  });
  const generator: IContextRules<T> = {
    inject(type, value) {
      dependencies.set(type, value());
      return this;
    },
    create() {
      return <any>Object.keys(subjects)
        .map(<K extends keyof T>(k: K) => ({ [k]: resolveActions(subjects[k], injector) }))
        .reduce((a, b) => ({ ...a, ...b }), {});
    }
  };
  return generator;
}

export abstract class Actions<T> {
  protected abstract readonly initial: Partial<T>;

  private __subject!: BehaviorSubject<T>;
  // private __lastProxy!: T;
  private __current: Partial<T> = {};
  private __timer: number;

  protected get subject(): BehaviorSubject<T> {
    return this.__subject || (this.__subject = new BehaviorSubject(<any>this.initial || null));
  }

  protected get last() {
    return this.subject.getValue();
  }

  protected update(data: Partial<T> = {}) {
    clearTimeout(this.__timer);
    this.__current = {
      ...this.__current,
      ...data
    };
    this.__timer = setTimeout(() => {
      this.subject.next({
        ...this.subject.getValue(),
        ...this.__current
      });
      this.__current = <any>{ __stamp: new Date().getTime() };
      // this.__lastProxy = undefined;
    });
  }
}

export function Context() {
  return function define_context(target: any) {
    return target;
  };
}

// export function SourceUpdate() {
//   return function source_update<T extends Actions<any>>(
//     prototype: T,
//     propertyKay: string,
//     descriptor: PropertyDescriptor
//   ) {
//     const source = descriptor.value;
//     descriptor.value = async function(this: T, ...args: any[]) {
//       // const [last, lastProxy] = this["initLastProxy"]();
//       // await source.call({ ...this, last: lastProxy }, ...args);
//       // this["update"](last);
//     };
//     Object.defineProperty(prototype, propertyKay, descriptor);
//   };
// }

export class ContextCenter<T> {
  private _generator: IContextRules<T>;
  private _datasets: ObserverMap<T>;
  private _actions: ActionMap<T>;
  protected readonly behaviors: ContextMap<T>;

  public get datasets(): ObserverMap<T> {
    return this._datasets;
  }

  public get actions(): ActionMap<T> {
    return this._actions;
  }

  protected createRules(subjects: T): ContextCenter<T> {
    this._generator = createRules(subjects);
    return this;
  }

  protected inject<TYPE>(token: IConstructor<TYPE>, factory: () => TYPE) {
    this._generator.inject(token, factory);
    return this;
  }

  protected finalize() {
    (<any>this.behaviors) = this._generator.create();
    const obseverKeys = Object.keys(this.behaviors);
    this._datasets = obseverKeys
      .map(name => [name, this.behaviors[name].observer])
      .reduce<any>((pre, [name, observer]) => ({ ...pre, [name]: observer }), {});
    this._actions = obseverKeys
      .map(name => [name, this.behaviors[name].actions])
      .reduce<any>((pre, [name, actions]) => ({ ...pre, [name]: actions }), {});
    this.init();
  }

  protected async init() {
    Object.keys(this.behaviors).forEach(async (name: string) => {
      const actions = this.behaviors[name].actions;
      if (actions["init"] && typeof actions["init"] === "function") {
        actions.init();
      }
    });
  }
}
