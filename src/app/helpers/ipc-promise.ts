import { ipcRenderer } from "electron";
import { get } from "lodash";

const RESOLVES = Symbol.for("@resolves");
const REJECTS = Symbol.for("@rejects");
const VALIDATES = Symbol.for("@validates");
const GLOBAL = Symbol.for("@global");
const REGISTERS = Symbol.for("@registers");

const defaultExtraxt = (data: any) => data;
const defaultValidate = (data: any) => !!data;

export class IpcPromiseLoader<T extends {} = {}> {
  private descriptors: { [p: string]: PropertyDescriptor } = {};

  constructor(private ipc: typeof ipcRenderer) {
    this.descriptors = Object.getOwnPropertyDescriptors(this);
    const prototype = Object.getPrototypeOf(this);
    const { [REGISTERS]: registers = {} } = prototype;
    Object.keys(registers).forEach(methodName => {
      const key = registers[methodName].value;
      this.register(key, <any>methodName);
    });
  }

  protected async<I = {}, T = void>(send?: I): Promise<T> {
    return Promise.resolve(send as any);
  }

  protected sync<I = {}, T = void>(send?: I): T {
    return null as any;
  }

  public register<K extends keyof IpcPromiseLoader | keyof T>(eventKey: string, target: K): IpcPromiseLoader;
  public register(key: string, action: string) {
    if (this.checkProtoMethod(this[action])) {
      const prototype = Object.getPrototypeOf(this);
      const descriptor = Object.getOwnPropertyDescriptor(prototype, action);
      const { [RESOLVES]: resolves = {}, [REJECTS]: rejects = {}, [VALIDATES]: validates = {} } = prototype;
      const resolveFn: Function = get(resolves[action], "value") || get(resolves[GLOBAL], "value") || defaultExtraxt;
      const rejectFn: Function = get(rejects[action], "value") || get(rejects[GLOBAL], "value") || defaultExtraxt;
      const validateFn: (data: any) => boolean =
        get(validates[action], "value") || get(validates[GLOBAL], "value") || defaultValidate;
      const source = descriptor.value;
      descriptor.value = async function(this: IpcPromiseLoader, args: any) {
        let params = source.call(this, args);
        if (params instanceof Promise) {
          params = await params;
          return new Promise((resolve, reject) => {
            this["ipc"].once(key, (_: any, result: any) => {
              const isValid = validateFn(result);
              if (isValid) {
                resolve(resolveFn(result));
              } else {
                reject(rejectFn(result));
              }
            });
            this["ipc"].send(key, params);
          });
        } else {
          this["ipc"].send(key, params);
        }
      };
      Object.defineProperty(prototype, action, descriptor);
    } else {
      throw new Error("invalid ipc promise register action.");
    }
    return this;
  }

  private checkProtoMethod(target: Function) {
    return Object.keys(this.descriptors).findIndex(name => this.descriptors[name].value === target);
  }
}

interface IIPCOptions {
  resolve: (data: any) => any;
  reject: (data: any) => any;
  validate: (data: any) => boolean;
}

export function Contract(register: string, options: Partial<IIPCOptions> = {}) {
  return function define_contract(prototype: any, propertyKey: string) {
    Register(register)(prototype, propertyKey);
    if (options.resolve) DefineResolve(options.resolve)(prototype, propertyKey);
    if (options.reject) DefineReject(options.reject)(prototype, propertyKey);
    if (options.validate) DefineValidate(options.validate)(prototype, propertyKey);
  };
}

export function Register(registerKey: string) {
  return function register(prototype: any, propertyKey: string) {
    const proto = prototype;
    const registers = proto[REGISTERS] || (proto[REGISTERS] = {});
    registers[propertyKey] = {
      value: registerKey
    };
  };
}

export function DefineResolve(resolve?: (data: any) => any) {
  return function define_resolve(prototype: any, propertyKey?: string) {
    const proto = !propertyKey ? prototype.prototype : prototype;
    const resolves = proto[RESOLVES] || (proto[RESOLVES] = {});
    resolves[propertyKey || GLOBAL] = {
      value: resolve || undefined
    };
  };
}

export function DefineReject(reject?: (data: any) => any) {
  return function define_reject(prototype: any, propertyKey?: string) {
    const proto = !propertyKey ? prototype.prototype : prototype;
    const rejects = proto[REJECTS] || (proto[REJECTS] = {});
    rejects[propertyKey || GLOBAL] = {
      value: reject || undefined
    };
  };
}

export function DefineValidate(validate?: (data: any) => boolean) {
  return function define_validate(prototype: any, propertyKey?: string) {
    const proto = !propertyKey ? prototype.prototype : prototype;
    const validates = proto[VALIDATES] || (proto[VALIDATES] = {});
    validates[propertyKey || GLOBAL] = {
      value: validate || undefined
    };
  };
}
