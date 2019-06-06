# README

Copyright 2016 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Gaffer Schema Builder

This project was generated with [angular-cli](https://github.com/angular/angular-cli).

### How to run

Install [NPM](https://www.npmjs.com/). Install angular-cli globally `npm install -g @angular/cli`. Install dependencies `npm install` from this folder \(gaffer-tools/schema-builder/schema-builder-ui\).

Run `ng serve` or `ng serve --prod` to set up a server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

For the validation and class lookup, the backend REST service also need to be running \(gaffer-tools/schema-builder/schema-builder-rest\).

#### Config

There is a config file located in 'src/config.json' From here you can set the url of the Gaffer REST API you want the UI to use. By default this is set to use 'localhost:8080'.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

#### Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

