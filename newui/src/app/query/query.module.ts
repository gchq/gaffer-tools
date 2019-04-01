import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UpgradeModule } from "@angular/upgrade/static";

import { QueryComponent } from "./query.component";
import { MaterialModule } from "../material.module";
import { LayoutModule } from "@angular/cdk/layout";

@NgModule({
  declarations: [
    QueryComponent
    // TableComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [QueryComponent]
})
export class QueryModule {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ["myquery"], { strictDi: true });
  }
}
