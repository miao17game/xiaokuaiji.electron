import { Actions, SourceUpdate, Context } from "../../helpers/context";
import { IFolderStruct } from "../../../../utils/metadata";
import { CoreService } from "../core.service";

interface IDashboardState {
  loading: boolean;
  folders: IFolderStruct;
}

@Context()
export class DashboardContext extends Actions<IDashboardState> {
  protected readonly behavior: IDashboardState = {
    loading: true,
    folders: {
      loaded: false,
      exist: true,
      path: "",
      files: [],
      folders: []
    }
  };

  constructor(private core: CoreService) {
    super();
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
