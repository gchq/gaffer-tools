import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AboutComponent } from "./about/about.component";
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, AboutComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
