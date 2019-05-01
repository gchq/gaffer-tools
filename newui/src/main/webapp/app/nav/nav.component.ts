import { Component } from "@angular/core";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent {
  navLinks = [
    { path: "analytics", label: "ANALYTICS" },
    { path: "parameters", label: "PARAMETERS" },
    { path: "results", label: "RESULTS" },
    { path: "about", label: "ABOUT" }
  ];
  activeLink = this.navLinks[0];
  background = "";

  toggleBackground() {
    this.background = this.background ? "" : "primary";
  }
}
