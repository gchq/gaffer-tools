import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err))

declare const require: any

const context = require.context('./app', true, /\.js$/)

context.keys().forEach((file: any) => {
  try {
    context(file)
  } catch (err) {
    console.error(err, file)
  }
})
