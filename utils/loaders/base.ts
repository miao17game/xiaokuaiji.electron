import { IpcMain, Event } from "electron";
import { AppError, ErrorCode } from "../metadata";

const REGISTERS = Symbol.for("@registers");

export interface IRegisterOptions {
  sync: boolean;
}

export class DefaultEventLoader {
  private descriptors: { [p: string]: PropertyDescriptor } = {};

  constructor(protected ipcMain: IpcMain) {
    this.descriptors = Object.getOwnPropertyDescriptors(this);
    const prototype = Object.getPrototypeOf(this);
    const { [REGISTERS]: registers = {} } = prototype;
    Object.keys(registers).forEach(methodName => {
      const key = registers[methodName].value;
      this.register(key, <any>methodName);
    });
  }

  private checkProtoMethod(target: Function) {
    return Object.keys(this.descriptors).findIndex(name => this.descriptors[name].value === target);
  }

  private register<K extends keyof DefaultEventLoader>(
    eventKey: string,
    target: K,
    options?: Partial<IRegisterOptions>
  ): DefaultEventLoader;
  private register<I = any, O = void>(
    eventKey: string,
    actions: <E>(inputs: I, event: Event) => O | AppError<E> | Promise<O | AppError<E>>,
    options?: Partial<IRegisterOptions>
  ): DefaultEventLoader;
  private register(key: string, action: string | Function, { sync = false } = {}) {
    const method = sync ? "sendSync" : "send";
    let actions = typeof action === "string" ? this[action] : action;
    if (this.checkProtoMethod(actions)) actions = actions.bind(this);
    this.ipcMain.on(key, async (event: Event, args: any = {}) => {
      try {
        const result = await actions(<any>args, event);
        if (!result) return event.sender[method](key, true);
        event.sender[method](key, result);
      } catch (error) {
        event.sender[method](key, createDefaultError(error));
      }
    });
    return this;
  }
}

export function Contract(register: string) {
  return function register_contract(prototype: any, propertyKey: string) {
    const proto = prototype;
    const registers = proto[REGISTERS] || (proto[REGISTERS] = {});
    registers[propertyKey] = {
      value: register
    };
  };
}

export function createStamp() {
  return new Date().getTime();
}

export function createUnknownError(error: any) {
  return new AppError(ErrorCode.Unknown, "unknown error.", {
    ...error,
    msg: error.message,
    stack: error.stack
  });
}

export function createDefaultError(error: any) {
  return new AppError(ErrorCode.Default, "action register error : unexpected error.", {
    ...error,
    msg: error.message,
    stack: error.stack
  });
}
