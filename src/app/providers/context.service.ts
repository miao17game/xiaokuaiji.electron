import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { IFolderStruct } from "../../../utils/metadata";
import { CoreService } from "./core.service";

const subjects = {
  dashboard: {
    subject: new BehaviorSubject<IFolderStruct>({
      loaded: false,
      exist: true,
      path: "",
      files: [],
      folders: []
    }),
    init: (core: CoreService) => core.dashboardFetch.call(core),
    actions: (subject: BehaviorSubject<IFolderStruct>, core: CoreService) => ({
      async referesh(onFinally: () => void) {
        try {
          const newData = await core.dashboardFetch.call(core);
          subject.next(newData);
        } finally {
          setTimeout(onFinally, 200);
        }
      },
      async init(onSuccess: () => void) {
        await core.dashboardInit.call(core);
        onSuccess();
      },
      async loadPart(currentRef: IFolderStruct, onSuccess?: (path: string) => void) {
        const lastData = subject.getValue();
        const newData = await core.dashboardFetch.call(core, currentRef.path);
        currentRef.files = newData.files;
        currentRef.folders = newData.folders;
        currentRef.loaded = true;
        subject.next({ ...lastData });
        onSuccess && onSuccess(currentRef.path);
      }
    })
  }
};

@Injectable()
export class ContextService {
  private observables = createRules(subjects, this);

  get dashboard() {
    return this.observables.dashboard;
  }

  constructor(private core: CoreService) {
    this.initServices();
  }

  private initServices() {
    Object.keys(subjects).forEach(async (name: keyof typeof subjects) => {
      const target: IEachSubject<any, any> = subjects[name];
      if (target.init) {
        const initData = await target.init(this.core);
        target.subject.next(initData);
      }
    });
  }
}

interface IEachSubject<T, A extends { [prop: string]: any }> {
  subject: BehaviorSubject<T>;
  actions: (subject: BehaviorSubject<T>, ...args: any[]) => A;
  init?(...args: any[]): Promise<T>;
}

type ObserverMap<T> = {
  [key in keyof T]: {
    observer: T[key] extends IEachSubject<infer S, infer A> ? Observable<S> : unknown;
    actions: T[key] extends IEachSubject<infer S, infer A> ? A : unknown;
  }
};

function createRules<T extends any>(subjects: T, context: ContextService): ObserverMap<T> {
  return <any>Object.keys(subjects)
    .map(<K extends keyof T>(k: K) => ({
      [k]: {
        observer: subjects[k].subject.asObservable(),
        actions: subjects[k].actions(subjects[k].subject, context["core"])
      }
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}
