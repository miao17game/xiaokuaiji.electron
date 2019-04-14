import { IDepts, Actions, SourceUpdate, Behavior } from "./context.base";
import { IFolderStruct } from "../../../../utils/metadata";

interface IState {
  loading: boolean;
  folders: IFolderStruct;
}

export class DashboardActions extends Actions<IState, IDepts> {
  @Behavior()
  private readonly behavior: IState = {
    loading: true,
    folders: {
      loaded: false,
      exist: true,
      path: "",
      files: [],
      folders: []
    }
  };

  get core() {
    return this.references.core;
  }

  constructor(references: IDepts) {
    super(references);
  }

  public async init() {
    this.update({ loading: true });
    const folders = await this.core.dashboardFetch();
    this.update({ folders });
    this.update({ loading: false });
  }

  public async initAppRoot() {
    await this.core.dashboardInit();
  }

  @SourceUpdate()
  public resetLoading(loading = false) {
    this.last.loading = loading;
  }

  @SourceUpdate()
  public async referesh() {
    const newData = await this.core.dashboardFetch();
    this.last.folders = newData;
  }

  @SourceUpdate()
  public async loadPart(currentRef: IFolderStruct) {
    const newData = await this.core.dashboardFetch(currentRef.path);
    currentRef.files = newData.files;
    currentRef.folders = newData.folders;
    currentRef.loaded = true;
  }
}
