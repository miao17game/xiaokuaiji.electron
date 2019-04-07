import { Component, OnInit } from "@angular/core";
import { IPreferenceConfig } from "../../../../utils/metadata";
import { CoreService } from "../../providers/core.service";

@Component({
  selector: "app-preference",
  templateUrl: "./preference.html",
  styleUrls: ["./style.scss"]
})
export class PreferenceComponent implements OnInit {
  public loading = true;
  public configs: IPreferenceConfig = {};

  constructor(private core: CoreService) {}

  async ngOnInit() {
    try {
      const result = await this.core.preferenceFetch();
      this.configs = result;
      this.loading = false;
    } catch (error) {
      console.log(error);
    }
  }
}
