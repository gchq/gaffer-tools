import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./main/webapp/app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

declare const require: any;

const context = require.context("./main/webapp/app", true, /\.js$/);

context.keys().forEach((file: any) => {
  try {
    context(file);
  } catch (err) {
    console.log(err, file);
  }
});
