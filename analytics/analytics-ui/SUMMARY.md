---
description: >-
  A brief explanation of the product, and instructions on how to run the UI and
  REST API.
---

# Overview & Getting Started

## Overview

The Analytic UI provides the capability for a user to run an ‘Analytic’ query and view the results. The Analytics are pre-defined and may contain parameters that can be changed by the user upon execution of the Analytic. The UI makes a REST API call to an endpoint exposed by the backend. Specific operations exist in the backend for the management of Analytics although the execution of an Analytic is via a NamedOperation. It is written in Typescript/Angular.

## Setting up

Install Homebrew - instructions can be found [here](https://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/)

Having cloned the gaffer-tools repo, in a terminal, navigate to the analytics/analytics-ui folder and run an npm install \(assuming you have npm installed - if you don't, follow [this guide](https://www.npmjs.com/get-npm) or use [Homebrew](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew)\):

```
$ npm install
```

Then, install the Angular CLI:

```text
$ npm install -g @angular/cli
```

Then, navigate to the top level of the repo and install Maven, which you can do either [this way](http://blog.netgloo.com/2014/08/14/installing-maven-on-mac-os-x-without-homebrew/) or via [Homebrew](https://www.code2bits.com/how-to-install-maven-on-macos-using-homebrew/). Then, run a maven clean install, using -DskipTests to ignore the tests and reduce the time this takes.

```text
$ mvn clean install -DskipTests
```

Finally, navigate into analytic-ui/analytics/analytics-rest, and run a mvn clean install, with -Pquick:

```text
$ mvn clean install -Pquick
```

## Running The REST API

Execute the following in analytics/analytics-rest:

```
$ mvn clean install -pl :analytics-rest -Proad-traffic-demo
```

The REST API should open up in your browser at http://localhost:8080/rest.

It is advised that you follow the subsequent steps to add your analytics to the restAPI **before** following the below instructions for starting the UI itself.

## Running The UI

In a separate terminal window or tab, navigate to the analytic-ui folder and type the following.

```
$ ng serve -o
```

The UI should open up in your default browser at http://localhost:4200, which will automatically reroute to http://localhost:4200/analytics, our home page. IF you have taken the steps necessary to add your analytics to the restAPI, this page should then have a grid populated with cards corresponding to said analytics.
