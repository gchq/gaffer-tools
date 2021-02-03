(function () {
  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
    /***/
    0:
    /*!***************************!*\
      !*** multi ./src/main.ts ***!
      \***************************/

    /*! no static exports found */

    /***/
    function _(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(
      /*! /home/x2026443/git/gaffer-tools/schema-builder/schema-builder-ui/src/main.ts */
      "zUnb");
      /***/
    },

    /***/
    "2bY6":
    /*!****************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/graph/entity-form/entity-form.component.html ***!
      \****************************************************************************************************/

    /*! exports provided: default */

    /***/
    function bY6(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n<div class=\"flex-container\" fxLayout=\"row\">\n    <div fxFlex></div>\n    <button md-raised-button color=\"accent\" mdTooltip=\"add new entity\" aria-label=\"add new entity\" (click)=\"addNewEntity();\"\n        class=\"button-spacing\">\n        Add Entity\n        </button>\n</div>\n<div style=\"margin: 10px 0 0 0;\">\n    <form [formGroup]=\"form\" novalidate>\n        <div *ngFor=\"let entity of entities\" id=\"{{entity.id}}\" style=\"margin: 10px 0; padding: 10px;\">\n            <div class=\"form-group\">\n                <div class=\"flex-container\" fxLayout=\"row\">\n                    <h4 style=\"margin-left: 10px; font-size: 18pt; word-break: break-all;\" fxFlex>{{entity.name}}</h4>\n                    <button mat-icon-button color=\"warn\" mdTooltip=\"delete entity\" aria-label=\"delete entity\" (click)=\"removeEntity(entity.id)\"\n                        class=\"button-spacing\" style=\"margin-top: 10px;\">\n                        <mat-icon>delete</mat-icon>\n                        </button>\n                </div>\n                <div class=\"input-field\">\n                    <input mdInput name=\"name\" class=\"full-width\" placeholder=\"Entity name\" formControlName=\"{{entity.id}}\">\n                </div>\n            </div>\n        </div>\n    </form>\n</div>\n";
      /***/
    },

    /***/
    "2gUZ":
    /*!************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/graph/edge-form/edge-form.component.html ***!
      \************************************************************************************************/

    /*! exports provided: default */

    /***/
    function gUZ(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n<form [formGroup]=\"form\" style=\"padding-top: 10px;\">\n    <div class=\"form-group\">\n        <div class=\"input-field\">\n            <md-select id=\"source\" placeholder=\"Source\" formControlName=\"from\" [(ngModel)]=\"_edge.from\" class=\"full-width\">\n                <md-option *ngFor=\"let node of nodeOptions\" [value]=\"node.id\">\n                    {{ node.label }}\n                </md-option>\n            </md-select>\n        </div>\n        <div class=\"input-field\">\n            <md-select id=\"destination\" placeholder=\"Destination\" formControlName=\"to\" [(ngModel)]=\"_edge.to\" class=\"full-width\">\n                <md-option *ngFor=\"let node of nodeOptions\" [value]=\"node.id\">\n                    {{ node.label }}\n                </md-option>\n            </md-select>\n        </div>\n        <div class=\"input-field\">\n            <input mdInput placeholder=\"Edge name\" formControlName=\"label\" [(ngModel)]=\"_edge.label\">\n        </div>\n        <div class=\"input-field\">\n            <md-select id=\"directed\" placeholder=\"Directed\" formControlName=\"arrows\" [(ngModel)]=\"_edge.arrows\" class=\"full-width\">\n                <md-option value=\"to\">\n                    True\n                </md-option>\n                <md-option value=\"none\">\n                    False\n                </md-option>\n            </md-select>\n        </div>\n    </div>\n</form>\n";
      /***/
    },

    /***/
    "5yZJ":
    /*!********************************************!*\
      !*** ./src/app/services/gaffer.service.ts ***!
      \********************************************/

    /*! exports provided: GafferService */

    /***/
    function yZJ(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "GafferService", function () {
        return GafferService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var _ngx_config_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @ngx-config/core */
      "XRVh");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var GafferService = /*#__PURE__*/function () {
        function GafferService(http, config) {
          _classCallCheck(this, GafferService);

          this.http = http;
          this.config = config;
          this.GAFFER_HOST = this.config.getSettings('system', 'gafferUrl');
        }

        _createClass(GafferService, [{
          key: "extractData",
          value: function extractData(res) {
            var body = res.body;
            return body || {};
          }
        }, {
          key: "handleError",
          value: function handleError(error) {
            var errMsg;

            if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpErrorResponse"]) {
              var body = error.error || '';
              var err = body.error || JSON.stringify(body);
              errMsg = "".concat(error.status, " - ").concat(error.statusText || '', " ").concat(err);
            } else {
              errMsg = error.message ? error.message : error.toString();
            }

            console.error(errMsg);
            return rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"]["throw"](errMsg);
          }
        }, {
          key: "getCommonTypes",
          value: function getCommonTypes() {
            var gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/commonSchema';
            var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
              'Content-Type': 'application/json'
            });
            var options = {
              headers: headers
            };
            return this.http.get(gafferUrl, options);
          }
        }, {
          key: "getSimpleFunctions",
          value: function getSimpleFunctions(typeName, typeClass) {
            var gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/functions';
            var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
              'Content-Type': 'application/json'
            });
            var params = {
              typeName: typeName,
              typeClass: typeClass
            };
            var options = {
              headers: headers,
              params: params
            };
            return this.http.post(gafferUrl, options);
          }
        }, {
          key: "validateSchema",
          value: function validateSchema(elements, types) {
            var gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/validate';
            var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
              'Content-Type': 'application/json'
            });
            var params = [elements, types];
            var options = {
              headers: headers,
              params: params
            };
            return this.http.post(gafferUrl, options);
          }
        }, {
          key: "getSchemaFromURL",
          value: function getSchemaFromURL(url) {
            var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
              'Content-Type': 'application/json'
            });
            var options = {
              headers: headers
            };
            return this.http.get(url, options);
          }
        }]);

        return GafferService;
      }();

      GafferService.ctorParameters = function () {
        return [{
          type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]
        }, {
          type: _ngx_config_core__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]
        }];
      };

      GafferService = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(), __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _ngx_config_core__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])], GafferService);
      /***/
    },

    /***/
    "6hER":
    /*!********************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/properties/properties.component.html ***!
      \********************************************************************************************/

    /*! exports provided: default */

    /***/
    function hER(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n  \n  <div style=\"padding: 15px;\" class=\"flex-container alt-background\" fxLayout=\"row\" fxLayoutAlign=\"center start\">\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n    <div fxFlex>\n        <h4 style=\"font-size: 16pt;\">Edges</h4>\n        <mat-card *ngIf=\"!edges || edges.length === 0\">\n            <mat-card-content>\n                <div>\n                    <md-list dense>\n                        <md-list-item>\n                            <h3 md-line><b>No edges</b></h3>\n                        </md-list-item>\n                    </md-list>\n                </div>\n            </mat-card-content>\n        </mat-card>\n        <div class=\"flex-container\" fxLayout=\"row\" fxLayoutWrap=\"wrap\">\n            <div fxFlex=\"50%\" fxFlex.gt-md=\"33%\" fxFlex.xs=\"100%\" style=\"padding: 10px;\" *ngFor=\"let edge of edges\">\n                <mat-card>\n                    <div class=\"content-card-header\" fxLayout=\"row\">\n                        <mat-card-title fxFlex style=\"word-break: break-all;\">{{edge.label}}</mat-card-title>\n                        <button mat-icon-button color=\"accent\" (click)=\"edge.editing = true;\" mdTooltip=\"edit edge properties\" aria-label=\"edit edge properties\" *ngIf=\"!edge.editing\" class=\"button-spacing\">\n                            <mat-icon>edit</mat-icon>\n                        </button>\n                    </div>\n                    <mat-card-content *ngIf=\"!edge.editing\">\n                        <div *ngIf=\"!edge.properties || edge.properties.length === 0\">\n                            <md-list dense>\n                                <md-list-item>\n                                    <h3 md-line><b>No properties</b></h3>\n                                </md-list-item>\n                            </md-list>\n                        </div>\n                        <div *ngIf=\"edge.properties && edge.properties.length > 0\">\n                            <md-list dense>\n                                <md-list-item *ngFor=\"let property of edge.properties\">\n                                    <h3 md-line><b>{{property.name}}</b></h3>\n                                    <p md-line>{{property.type}}</p>\n                                </md-list-item>\n                            </md-list>\n                        </div>\n                    </mat-card-content>\n                    <mat-card-content *ngIf=\"edge.editing\" style=\"overflow: visible;\">\n                        <app-property-form [propertyHolder]=\"edge\" (holderChange)=\"edgePropertiesChanged($event)\"></app-property-form>\n                    </mat-card-content>\n                </mat-card>\n            </div>\n        </div>\n        <h4 style=\"font-size: 16pt;\">Entities</h4>\n        <mat-card *ngIf=\"!nodes || nodes.length === 0\">\n            <mat-card-content>\n                <div>\n                    <md-list dense>\n                        <md-list-item>\n                            <h3 md-line><b>No entities</b></h3>\n                        </md-list-item>\n                    </md-list>\n                </div>\n            </mat-card-content>\n        </mat-card>\n        <div *ngFor=\"let node of nodes\">\n            <h3 style=\"font-size: 12pt;\" *ngIf=\"node.entities && node.entities.length > 0\"><b>{{node.label}}</b></h3>\n            <div class=\"flex-container\" fxLayout=\"row\" fxLayoutWrap=\"wrap\">\n                <div fxFlex=\"50%\" fxFlex.gt-md=\"33%\" fxFlex.xs=\"100%\" style=\"padding: 10px;\" *ngFor=\"let entity of node.entities\">\n                    <mat-card>\n                        <div class=\"content-card-header\" fxLayout=\"row\">\n                            <mat-card-title fxFlex style=\"word-break: break-all;\">{{entity.name}}</mat-card-title>\n                            <button mat-icon-button color=\"accent\" (click)=\"entity.editing = true;\" mdTooltip=\"edit entity properties\" aria-label=\"edit entity properties\" *ngIf=\"!entity.editing\" class=\"button-spacing\">\n                                <mat-icon>edit</mat-icon>\n                            </button>\n                        </div>\n                        <mat-card-content *ngIf=\"!entity.editing\">\n                            <div *ngIf=\"!entity.properties || entity.properties.length === 0\">\n                                <md-list dense>\n                                    <md-list-item>\n                                        <h3 md-line><b>No properties</b></h3>\n                                    </md-list-item>\n                                </md-list>\n                            </div>\n                            <div *ngIf=\"entity.properties && entity.properties.length > 0\">\n                                <md-list dense>\n                                    <md-list-item *ngFor=\"let property of entity.properties\">\n                                        <h3 md-line><b>{{property.name}}</b></h3>\n                                        <p md-line>{{property.type}}</p>\n                                    </md-list-item>\n                                </md-list>\n                            </div>\n                        </mat-card-content>\n                        <mat-card-content *ngIf=\"entity.editing\" style=\"overflow: visible;\">\n                            <app-property-form [propertyHolder]=\"entity\" (holderChange)=\"entityPropertiesChanged($event)\"></app-property-form>\n                        </mat-card-content>\n                    </mat-card>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n</div>\n";
      /***/
    },

    /***/
    "A3xY":
    /*!***********************************!*\
      !*** ./src/app/app.component.css ***!
      \***********************************/

    /*! exports provided: default */

    /***/
    function A3xY(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "mat-card-title {\n  margin-bottom: 0 !important;\n  color: white;\n}\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsMkJBQTJCO0VBQzNCLFlBQVk7QUFDZCIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIm1hdC1jYXJkLXRpdGxlIHtcbiAgbWFyZ2luLWJvdHRvbTogMCAhaW1wb3J0YW50O1xuICBjb2xvcjogd2hpdGU7XG59XG5cbiJdfQ== */";
      /***/
    },

    /***/
    "AytR":
    /*!*****************************************!*\
      !*** ./src/environments/environment.ts ***!
      \*****************************************/

    /*! exports provided: environment */

    /***/
    function AytR(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "environment", function () {
        return environment;
      });
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */
      // The file for the current environment will overwrite this one during build.
      // Different environments can be found in ./environment.{dev|prod}.ts, and
      // you can create your own and use it with the --env flag.
      // The build system defaults to the dev environment.


      var environment = {
        production: false
      };
      /***/
    },

    /***/
    "DVaU":
    /*!*************************************************************!*\
      !*** ./src/app/graph/entity-form/entity-form.component.css ***!
      \*************************************************************/

    /*! exports provided: default */

    /***/
    function DVaU(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.input-field {\n    margin-right: 30px;\n}\n\n.form-button {\n    margin: 20px;\n    height: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS1mb3JtLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7O0FBRUY7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLFlBQVk7QUFDaEIiLCJmaWxlIjoiZW50aXR5LWZvcm0uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNiBDcm93biBDb3B5cmlnaHRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLmZvcm0tcm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZmxvdzogcm93IHdyYXA7XG59XG5cbi5pbnB1dC1maWVsZCB7XG4gICAgbWFyZ2luLXJpZ2h0OiAzMHB4O1xufVxuXG4uZm9ybS1idXR0b24ge1xuICAgIG1hcmdpbjogMjBweDtcbiAgICBoZWlnaHQ6IDM1cHg7XG59Il19 */";
      /***/
    },

    /***/
    "F5e3":
    /*!*******************************************!*\
      !*** ./src/app/graph/graph.component.css ***!
      \*******************************************/

    /*! exports provided: default */

    /***/
    function F5e3(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\ndiv.vis-network div.vis-manipulation {\n  background: transparent !important;\n  height: 35px !important;\n  padding-top: 0 !important;\n  border: 0 !important;\n  margin: 10px 0;\n  top: -55px !important;\n}\n\ndiv.vis-network div.vis-edit-mode {\n  padding-top: 0 !important;\n  border: 0 !important;\n  margin: 10px 0;\n  top: -27px !important;\n}\n\ndiv.vis-network div.vis-close {\n  display: none !important;\n}\n\n.vis-separator-line {\n  background: transparent !important;\n}\n\n.vis-button {\n  border-radius: 3px !important;\n  padding: 5px 15px !important;\n  height: 25px !important;\n  background-position: 8px 5px !important;\n}\n\n.vis-network {\n  margin-top: 70px;\n  overflow: visible !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYXBoLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7O0FBRUY7RUFDRSxrQ0FBa0M7RUFDbEMsdUJBQXVCO0VBQ3ZCLHlCQUF5QjtFQUN6QixvQkFBb0I7RUFDcEIsY0FBYztFQUNkLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixvQkFBb0I7RUFDcEIsY0FBYztFQUNkLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLDZCQUE2QjtFQUM3Qiw0QkFBNEI7RUFDNUIsdUJBQXVCO0VBQ3ZCLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQiw0QkFBNEI7QUFDOUIiLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNiBDcm93biBDb3B5cmlnaHRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZGl2LnZpcy1uZXR3b3JrIGRpdi52aXMtbWFuaXB1bGF0aW9uIHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAzNXB4ICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmctdG9wOiAwICFpbXBvcnRhbnQ7XG4gIGJvcmRlcjogMCAhaW1wb3J0YW50O1xuICBtYXJnaW46IDEwcHggMDtcbiAgdG9wOiAtNTVweCAhaW1wb3J0YW50O1xufVxuXG5kaXYudmlzLW5ldHdvcmsgZGl2LnZpcy1lZGl0LW1vZGUge1xuICBwYWRkaW5nLXRvcDogMCAhaW1wb3J0YW50O1xuICBib3JkZXI6IDAgIWltcG9ydGFudDtcbiAgbWFyZ2luOiAxMHB4IDA7XG4gIHRvcDogLTI3cHggIWltcG9ydGFudDtcbn1cblxuZGl2LnZpcy1uZXR3b3JrIGRpdi52aXMtY2xvc2Uge1xuICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbi52aXMtc2VwYXJhdG9yLWxpbmUge1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xufVxuXG4udmlzLWJ1dHRvbiB7XG4gIGJvcmRlci1yYWRpdXM6IDNweCAhaW1wb3J0YW50O1xuICBwYWRkaW5nOiA1cHggMTVweCAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDI1cHggIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogOHB4IDVweCAhaW1wb3J0YW50O1xufVxuXG4udmlzLW5ldHdvcmsge1xuICBtYXJnaW4tdG9wOiA3MHB4O1xuICBvdmVyZmxvdzogdmlzaWJsZSAhaW1wb3J0YW50O1xufSJdfQ== */";
      /***/
    },

    /***/
    "JiCe":
    /*!*********************************************************!*\
      !*** ./src/app/types/type-form/type-form.component.css ***!
      \*********************************************************/

    /*! exports provided: default */

    /***/
    function JiCe(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.input-field {\n    margin-right: 30px;\n}\n\n.form-button {\n    margin: 20px;\n    height: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGUtZm9ybS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFlBQVk7SUFDWixZQUFZO0FBQ2hCIiwiZmlsZSI6InR5cGUtZm9ybS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE2IENyb3duIENvcHlyaWdodFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4uZm9ybS1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1mbG93OiByb3cgd3JhcDtcbn1cblxuLmlucHV0LWZpZWxkIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XG59XG5cbi5mb3JtLWJ1dHRvbiB7XG4gICAgbWFyZ2luOiAyMHB4O1xuICAgIGhlaWdodDogMzVweDtcbn0iXX0= */";
      /***/
    },

    /***/
    "KVtm":
    /*!*****************************************!*\
      !*** ./src/app/schema/schema.routes.ts ***!
      \*****************************************/

    /*! exports provided: schemaRoutes */

    /***/
    function KVtm(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "schemaRoutes", function () {
        return schemaRoutes;
      });
      /* harmony import */


      var _schema_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./schema.component */
      "zvzT");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var schemaRoutes = [{
        path: 'schema',
        component: _schema_component__WEBPACK_IMPORTED_MODULE_0__["SchemaComponent"]
      }];
      /***/
    },

    /***/
    "LPyS":
    /*!********************************************************!*\
      !*** ./src/app/graph/edge-form/edge-form.component.ts ***!
      \********************************************************/

    /*! exports provided: EdgeFormComponent */

    /***/
    function LPyS(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "EdgeFormComponent", function () {
        return EdgeFormComponent;
      });
      /* harmony import */


      var _raw_loader_edge_form_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./edge-form.component.html */
      "2gUZ");
      /* harmony import */


      var _edge_form_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./edge-form.component.css */
      "YbjM");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var EdgeFormComponent = /*#__PURE__*/function () {
        function EdgeFormComponent(storage, formBuilder) {
          _classCallCheck(this, EdgeFormComponent);

          this.storage = storage;
          this.formBuilder = formBuilder;
        }

        _createClass(EdgeFormComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this = this;

            this._storedTypes = this.storage.retrieve('types');
            this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(function (data) {
              return _this.save(data);
            });
          }
        }, {
          key: "updateForm",
          value: function updateForm(edge) {
            this.form = this.formBuilder.group({
              from: edge.from,
              to: edge.to,
              label: edge.label,
              arrows: edge.arrows
            });
          }
        }, {
          key: "changeEdge",
          value: function changeEdge(value, key) {
            this._edge[key] = value;
          }
        }, {
          key: "save",
          value: function save(data) {
            this._edge = lodash__WEBPACK_IMPORTED_MODULE_5__["merge"](this._edge, data);

            this._edges.update(this._edge);

            this.storage.store('graphEdges', this._edges);
          }
        }, {
          key: "edges",
          set: function set(edges) {
            this._edges = edges;
          },
          get: function get() {
            return this._edges;
          }
        }, {
          key: "nodes",
          set: function set(nodes) {
            this._nodes = nodes;
            this.nodeOptions = nodes.get();
          },
          get: function get() {
            return this._nodes;
          }
        }, {
          key: "selectedEdge",
          set: function set(selectedEdge) {
            this._edge = this._edges.get(selectedEdge);
            this.updateForm(this._edge);
          }
        }, {
          key: "network",
          set: function set(network) {
            this._network = network;
          }
        }]);

        return EdgeFormComponent;
      }();

      EdgeFormComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]
        }];
      };

      EdgeFormComponent.propDecorators = {
        edges: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        nodes: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        selectedEdge: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        network: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }]
      };
      EdgeFormComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-edge-form',
        template: _raw_loader_edge_form_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]],
        styles: [_edge_form_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]])], EdgeFormComponent);
      /***/
    },

    /***/
    "Mm4O":
    /*!*********************************************!*\
      !*** ./src/app/schema/schema.component.css ***!
      \*********************************************/

    /*! exports provided: default */

    /***/
    function Mm4O(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.type-edit-button {\n    position: absolute;\n    top: 20px;\n    right: 20px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtYS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxXQUFXO0FBQ2YiLCJmaWxlIjoic2NoZW1hLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgQ3Jvd24gQ29weXJpZ2h0XG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi50eXBlLWVkaXQtYnV0dG9uIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAyMHB4O1xuICAgIHJpZ2h0OiAyMHB4O1xufSJdfQ== */";
      /***/
    },

    /***/
    "QaC4":
    /*!**********************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/types/types.component.html ***!
      \**********************************************************************************/

    /*! exports provided: default */

    /***/
    function QaC4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n  <div style=\"padding: 15px;\" class=\"flex-container alt-background\" fxLayout=\"row\" fxLayoutAlign=\"center start\">\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n    <div fxFlex>\n        <div class=\"flex-container\" fxLayout=\"row\">\n            <div fxFlex></div>\n            <button md-raised-button color=\"accent\" (click)=\"addNewType();\" mdTooltip=\"add new type\" aria-label=\"add new type\" class=\"button-spacing\">\n                Add type\n            </button>\n            <button md-raised-button color=\"warn\" (click)=\"resetTypes();\" mdTooltip=\"reset to default types\" aria-label=\"reset to default types\" class=\"button-spacing\">\n                Reset\n            </button>\n        </div>\n        <div class=\"flex-container\" fxLayout=\"row\" fxLayoutWrap=\"wrap\">\n            <div fxFlex=\"100%\" fxFlex.gt-sm=\"50%\" style=\"padding: 10px;\" *ngFor=\"let type of types; let i = index\">\n                <mat-card>\n                    <div class=\"content-card-header\" fxLayout=\"row\">\n                        <mat-card-title fxFlex style=\"word-break: break-all;\">{{type.type}}</mat-card-title>\n                        <button mat-icon-button color=\"accent\" (click)=\"type.editing = true;\" mdTooltip=\"edit type\" aria-label=\"edit type\" *ngIf=\"!type.editing\" class=\"button-spacing\">\n                            <mat-icon>edit</mat-icon>\n                        </button>\n                        <button mat-icon-button color=\"warn\" (click)=\"removeType(i)\" mdTooltip=\"delete type\" aria-label=\"delete type\" class=\"button-spacing\">\n                            <mat-icon>delete</mat-icon>\n                        </button>\n                    </div>\n                    <mat-card-content>\n                        <div *ngIf=\"!type.editing\">\n                            <md-list dense>\n                                <md-list-item>\n                                    <h3 md-line><b>Class</b></h3>\n                                    <p md-line>{{type.class}}</p>\n                                </md-list-item>\n                                <md-list-item>\n                                    <h3 md-line><b>Serialiser</b></h3>\n                                    <p md-line *ngIf=\"type.serialiser && type.serialiser.class\">{{type.serialiser.class}}</p>\n                                    <p md-line *ngIf=\"!type.serialiser || !type.serialiser.class\">null</p>\n                                </md-list-item>\n                                <md-list-item>\n                                    <h3 md-line><b>Aggregator</b></h3>\n                                    <p md-line *ngIf=\"type.aggregateFunction && type.aggregateFunction.class\">{{type.aggregateFunction.class}}</p>\n                                    <p md-line *ngIf=\"!type.aggregateFunction || !type.aggregateFunction.class\">null</p>\n                                </md-list-item>\n                                <md-list-item class=\"autoheight-list\">\n                                    <h3 md-line><b>Validators</b></h3>\n                                    <p md-line *ngFor=\"let validator of type.validateFunctions\">{{validator.class}}</p>\n                                    <p md-line *ngIf=\"!type.validateFunctions || type.validateFunctions.length === 0\">null</p>\n                                </md-list-item>\n                            </md-list>\n                        </div>\n                        <app-type-form [type]=\"types[i]\" (typeChange)=\"typeChanged($event)\" *ngIf=\"type.editing\"></app-type-form>\n                    </mat-card-content>\n                </mat-card>\n            </div>\n            <div  fxFlex=\"100%\" fxFlex.gt-sm=\"50%\" style=\"padding: 10px;\" *ngFor=\"let type of nodeTypes; let i = index\">\n                <mat-card>\n                    <div class=\"content-card-header\" fxLayout=\"row\">\n                        <mat-card-title fxFlex style=\"word-break: break-all;\">{{type.type}}</mat-card-title>\n                        <button mat-icon-button color=\"accent\" (click)=\"type.editing = true;\" mdTooltip=\"edit type\" aria-label=\"edit type\" *ngIf=\"!type.editing\" class=\"button-spacing\">\n                            <mat-icon>edit</mat-icon>\n                        </button>\n                        <button mat-icon-button color=\"warn\" (click)=\"removeType(i)\" mdTooltip=\"delete type\" aria-label=\"delete type\" class=\"button-spacing\">\n                            <mat-icon>delete</mat-icon>\n                        </button>\n                    </div>\n                    <mat-card-content>\n                        <div *ngIf=\"!type.editing\">\n                            <md-list dense>\n                                <md-list-item>\n                                    <h3 md-line><b>Class</b></h3>\n                                    <p md-line>{{type.class}}</p>\n                                </md-list-item>\n                                <md-list-item class=\"autoheight-list\">\n                                    <h3 md-line><b>Validators</b></h3>\n                                    <p md-line *ngFor=\"let validator of type.validateFunctions\">{{validator.class}}</p>\n                                    <p md-line *ngIf=\"!type.validateFunctions || type.validateFunctions.length === 0\">null</p>\n                                </md-list-item>\n                            </md-list>\n                        </div>\n                        <app-type-form [type]=\"nodeTypes[i]\" (typeChange)=\"nodeTypeChanged($event)\" *ngIf=\"type.editing\"></app-type-form>\n                    </mat-card-content>\n                </mat-card>\n            </div>\n        </div>\n    </div>\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n</div>\n";
      /***/
    },

    /***/
    "RUEf":
    /*!*******************************!*\
      !*** ./src/app/app.routes.ts ***!
      \*******************************/

    /*! exports provided: routes, routing */

    /***/
    function RUEf(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "routes", function () {
        return routes;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "routing", function () {
        return routing;
      });
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _graph_graph_routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./graph/graph.routes */
      "YXuy");
      /* harmony import */


      var _properties_properties_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./properties/properties.routes */
      "t+05");
      /* harmony import */


      var _schema_schema_routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./schema/schema.routes */
      "KVtm");
      /* harmony import */


      var _types_types_routes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ./types/types.routes */
      "pNCB");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var routes = [{
        path: '',
        redirectTo: '/graph',
        pathMatch: 'full'
      }].concat(_toConsumableArray(_graph_graph_routes__WEBPACK_IMPORTED_MODULE_1__["graphRoutes"]), _toConsumableArray(_properties_properties_routes__WEBPACK_IMPORTED_MODULE_2__["propertiesRoutes"]), _toConsumableArray(_schema_schema_routes__WEBPACK_IMPORTED_MODULE_3__["schemaRoutes"]), _toConsumableArray(_types_types_routes__WEBPACK_IMPORTED_MODULE_4__["typesRoutes"]));

      var routing = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes);
      /***/

    },

    /***/
    "Sy1n":
    /*!**********************************!*\
      !*** ./src/app/app.component.ts ***!
      \**********************************/

    /*! exports provided: AppComponent, NavLinkComponent */

    /***/
    function Sy1n(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
        return AppComponent;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "NavLinkComponent", function () {
        return NavLinkComponent;
      });
      /* harmony import */


      var _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./app.component.html */
      "VzVu");
      /* harmony import */


      var _app_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./app.component.css */
      "A3xY");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var AppComponent = /*#__PURE__*/function () {
        function AppComponent(router, route) {
          _classCallCheck(this, AppComponent);

          this.router = router;
          this.route = route;
          this.pages = [{
            title: 'Graph',
            route: 'graph'
          }, {
            title: 'Properties',
            route: 'properties'
          }, {
            title: 'Types',
            route: 'types'
          }, {
            title: 'Schema',
            route: 'schema'
          }];
          this.rlaSafe = false;
        }

        _createClass(AppComponent, [{
          key: "ngAfterViewInit",
          value: function ngAfterViewInit() {
            this.rlaSafe = true;
          }
        }, {
          key: "activateLink",
          value: function activateLink(index, linkIsActivated) {
            this.activeLinkIndex = index;
            console.log(linkIsActivated);
          }
        }]);

        return AppComponent;
      }();

      AppComponent.ctorParameters = function () {
        return [{
          type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]
        }];
      };

      AppComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-root',
        template: _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_app_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]])], AppComponent);

      var NavLinkComponent = /*#__PURE__*/function () {
        function NavLinkComponent() {
          _classCallCheck(this, NavLinkComponent);
        }

        _createClass(NavLinkComponent, [{
          key: "tabName",
          set: function set(name) {
            this._tabName = name;
          }
        }]);

        return NavLinkComponent;
      }();

      NavLinkComponent.propDecorators = {
        tabName: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }]
      };
      NavLinkComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-nav-link',
        template: '{{_tabName}}'
      })], NavLinkComponent);
      /***/
    },

    /***/
    "UumJ":
    /*!****************************************************!*\
      !*** ./src/app/properties/properties.component.ts ***!
      \****************************************************/

    /*! exports provided: PropertiesComponent */

    /***/
    function UumJ(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "PropertiesComponent", function () {
        return PropertiesComponent;
      });
      /* harmony import */


      var _raw_loader_properties_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./properties.component.html */
      "6hER");
      /* harmony import */


      var _properties_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./properties.component.css */
      "kvz0");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var PropertiesComponent = /*#__PURE__*/function () {
        function PropertiesComponent(storage) {
          _classCallCheck(this, PropertiesComponent);

          this.storage = storage;
        }

        _createClass(PropertiesComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this2 = this;

            this.types = this.storage.retrieve('types');
            var storedEdges = this.storage.retrieve('graphEdges');

            if (storedEdges !== null) {
              this.edges = [];
              lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](storedEdges._data, function (edge, key) {
                edge.id = key;

                _this2.edges.push(edge);
              });
            }

            var storedNodes = this.storage.retrieve('graphNodes');

            if (storedNodes !== null) {
              this.nodes = [];
              lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](storedNodes._data, function (node, key) {
                node.id = key;

                _this2.nodes.push(node);
              });
            }
          }
        }, {
          key: "edgePropertiesChanged",
          value: function edgePropertiesChanged(event) {
            var storedEdges = this.storage.retrieve('graphEdges');
            lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](storedEdges._data, function (edge) {
              if (edge.id === event.value.id) {
                edge.properties = event.value.properties;
                edge.editing = false;
              }
            });
            this.storage.store('graphEdges', storedEdges);
          }
        }, {
          key: "entityPropertiesChanged",
          value: function entityPropertiesChanged(event) {
            var storedNodes = this.storage.retrieve('graphNodes');
            lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](storedNodes._data, function (node) {
              lodash__WEBPACK_IMPORTED_MODULE_4__["forEach"](node.entities, function (entity) {
                if (entity.id === event.value.id) {
                  entity.properties = event.value.properties;
                  entity.editing = false;
                }
              });
            });
            this.storage.store('graphNodes', storedNodes);
          }
        }]);

        return PropertiesComponent;
      }();

      PropertiesComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }];
      };

      PropertiesComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-properties',
        template: _raw_loader_properties_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_properties_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]])], PropertiesComponent);
      /***/
    },

    /***/
    "V8dP":
    /*!*************************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/properties/property-form/property-form.component.html ***!
      \*************************************************************************************************************/

    /*! exports provided: default */

    /***/
    function V8dP(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n<div class=\"flex-container\" fxLayout=\"row\">\n    <div fxFlex></div>\n    <button md-raised-button color=\"accent\" (click)=\"addNewProperty();\" mdTooltip=\"add new property\" aria-label=\"add new property\"\n        class=\"button-spacing\">\n        Add Property\n        </button>\n</div>\n    <div class=\"form-group\">\n        <div style=\"margin-top: 20px;\">\n            <div *ngIf=\"!_propertyHolder.properties || _propertyHolder.properties.length === 0\">\n                <md-list dense>\n                    <md-list-item>\n                        <h3 md-line><b>No properties</b></h3>\n                    </md-list-item>\n                </md-list>\n            </div>\n            <div class=\"flex-container\" fxLayout=\"row\" fxLayoutGap=\"10px\" *ngFor=\"let property of _propertyHolder.properties\">\n                <div class=\"input-field\" fxFlex>\n                    <input mdInput class=\"full-width\" placeholder=\"Property name\" [(ngModel)]=\"property.name\">\n                </div>\n                <div class=\"input-field\" fxFlex>\n                    <md-select id=\"{{property.id}}Type\" placeholder=\"Property Type\" [(ngModel)]=\"property.type\">\n                        <md-option *ngFor=\"let type of _storedTypes\" [value]=\"type.type\">\n                            {{ type.type}}\n                        </md-option>\n                    </md-select>\n                </div>\n                <button mat-icon-button color=\"warn\" (click)=\"removeProperty(property.id)\" mdTooltip=\"delete property\" aria-label=\"delete property\" class=\"button-spacing\" style=\"margin-top: 15px;\">\n                    <mat-icon>delete</mat-icon>\n                </button>\n            </div>\n        </div>\n        <div class=\"flex-container\" fxLayout=\"row\">\n            <div fxFlex></div>\n            <button class=\"form-button button-spacing\" (click)=\"save()\" mdTooltip=\"update properties\" aria-label=\"update properties\" md-raised-button color=\"primary\">Update</button>\n        </div>\n    </div>\n";
      /***/
    },

    /***/
    "ViYI":
    /*!******************************************!*\
      !*** ./src/app/types/types.component.ts ***!
      \******************************************/

    /*! exports provided: TypesComponent */

    /***/
    function ViYI(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "TypesComponent", function () {
        return TypesComponent;
      });
      /* harmony import */


      var _raw_loader_types_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./types.component.html */
      "QaC4");
      /* harmony import */


      var _types_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./types.component.css */
      "Y7uA");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ../services/gaffer.service */
      "5yZJ");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var TypesComponent = /*#__PURE__*/function () {
        function TypesComponent(storage, gafferService) {
          _classCallCheck(this, TypesComponent);

          this.storage = storage;
          this.gafferService = gafferService;
        }

        _createClass(TypesComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var storedTypes = this.storage.retrieve('types');

            if (storedTypes !== null) {
              this.types = storedTypes;
              this.getNodes();
            } else {
              this.resetTypes();
            }
          }
        }, {
          key: "getNodes",
          value: function getNodes() {
            var _this3 = this;

            var storedNodes = this.storage.retrieve('graphNodes');

            if (storedNodes !== null) {
              this.nodeTypes = [];
              lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"](storedNodes._data, function (node) {
                _this3.nodeTypes.push({
                  type: node.label,
                  "class": node["class"] || 'java.lang.String',
                  validateFunctions: node.validateFunctions || [],
                  aggregateFunction: null,
                  index: _this3.nodeTypes.length,
                  node: true
                });
              });
            }
          }
        }, {
          key: "resetTypes",
          value: function resetTypes() {
            var _this4 = this;

            this.gafferService.getCommonTypes().subscribe(function (commonTypes) {
              return _this4.formatTypes(commonTypes.types);
            }, function (error) {
              return _this4.errorMessage = error;
            });
            this.getNodes();
          }
        }, {
          key: "removeType",
          value: function removeType(index) {
            this.types.splice(index, 1);
            this.storage.store('types', this.types);
          }
        }, {
          key: "addNewType",
          value: function addNewType() {
            this.types.push({
              type: 'new type',
              aggregateFunction: null,
              serialiser: null,
              "class": '',
              validateFunctions: null
            });
          }
        }, {
          key: "formatTypes",
          value: function formatTypes(commonTypes) {
            var _this5 = this;

            this.types = [];
            lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"](commonTypes, function (type, key) {
              type.type = key;
              type.index = _this5.types.length;

              _this5.types.push(type);
            });
            this.storage.store('types', this.types);
          }
        }, {
          key: "typeChanged",
          value: function typeChanged(event) {
            var type = event.value;
            this.types[type.index] = type;
            this.types[type.index].editing = false;
            this.storage.store('types', this.types);
          }
        }, {
          key: "nodeTypeChanged",
          value: function nodeTypeChanged(event) {
            var type = event.value;
            var storedNodes = this.storage.retrieve('graphNodes');

            if (storedNodes !== null) {
              lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"](storedNodes._data, function (node) {
                if (node.label === type.type) {
                  node["class"] = type["class"];
                  node.validateFunctions = type.validateFunctions;
                }
              });
            }

            this.nodeTypes[type.index].editing = false;
            this.storage.store('graphNodes', storedNodes);
          }
        }]);

        return TypesComponent;
      }();

      TypesComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]
        }];
      };

      TypesComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-types',
        template: _raw_loader_types_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]],
        styles: [_types_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]])], TypesComponent);
      /***/
    },

    /***/
    "VzVu":
    /*!**************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
      \**************************************************************************/

    /*! exports provided: default */

    /***/
    function VzVu(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<mat-toolbar color=\"primary\">\n    <img src=\"assets/gafferlogowhite.png\" width=\"30px\" style=\"margin-right: 15px;\" />\n    <h1 style=\"font-size: 22pt; font-weight: 800;\">Gaffer Schema Builder</h1>\n    <span class=\"app-toolbar-filler\"></span>\n</mat-toolbar>\n<nav mat-tab-nav-bar>\n    <a mat-tab-link\n        *ngFor=\"let child of pages\"\n        [routerLink]=\"child.route\"\n        routerLinkActive #rla=\"routerLinkActive\"\n        [active]=\"rlaSafe && rla.isActive\"> {{ child.title }}\n    </a>\n</nav>\n\n<router-outlet class=\"alt-background\"></router-outlet>\n";
      /***/
    },

    /***/
    "X3I5":
    /*!************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/types/type-form/type-form.component.html ***!
      \************************************************************************************************/

    /*! exports provided: default */

    /***/
    function X3I5(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<div class=\"form-group\">\n    <div style=\"margin-bottom: 0;\">\n        <div class=\"input-field\" *ngIf=\"!_type.node\">\n            <input mdInput class=\"form-control full-width\" type=\"text\" name=\"type\" placeholder=\"Type name\" [(ngModel)]=\"_type.type\" (ngModelChange)=\"changeType($event, 'type')\">\n        </div>\n        <div class=\"input-field\">\n            <input mdInput class=\"form-control full-width\" type=\"text\" name=\"class\" placeholder=\"Java class\" [(ngModel)]=\"_type.class\" (ngModelChange)=\"changeType($event, 'class')\">\n        </div>\n        <div class=\"input-field\" *ngIf=\"functions && functions.valid && !_type.node\">\n            <md-select class=\"full-width\" id=\"serialiserClass\" placeholder=\"Serialiser class\" (change)=\"changeType(_type.serialiser, 'serialiser', 'class')\"\n                [(ngModel)]=\"_type.serialiser\">\n                <md-option value=\"NULL\">null</md-option>\n                <md-option *ngFor=\"let serialiser of functions.serialiserClasses\" [value]=\"serialiser\">\n                    {{ serialiser }}\n                </md-option>\n            </md-select>\n        </div>\n        <div class=\"input-field\" *ngIf=\"functions && functions.valid && !_type.node\">\n            <md-select class=\"full-width\" id=\"aggregateFunction\" placeholder=\"Aggregator class\" (change)=\"changeType(_type.aggregateFunction, 'aggregateFunction', 'class')\"\n                [(ngModel)]=\"_type.aggregateFunction\">\n                <md-option value=\"NULL\">null</md-option>\n                <md-option *ngFor=\"let aggregator of functions.aggregateClasses\" [value]=\"aggregator\">\n                    {{ aggregator }}\n                </md-option>\n                </md-select>\n        </div>\n        <div class=\"input-field\" *ngIf=\"functions && functions.valid && !_type.node\">\n            <input mdInput class=\"form-control full-width\" type=\"text\" [disabled]=\"aggregateFieldsDisabled\" name=\"aggregateFields\" placeholder=\"Aggregator fields\"\n                [(ngModel)]=\"aggregateFields\" (ngModelChange)=\"changeType($event, 'aggregateFields')\">\n            <p style=\"color: red; margin-top: -10px;\" *ngIf=\"!aggregateFieldsValid\">Invalid JSON</p>\n        </div>\n        <div *ngIf=\"functions && functions.valid\">\n            <label>Validation</label>\n            <div *ngFor=\"let validator of functions.validateClasses\" style=\"padding: 10px 0;\">\n                <md-checkbox [checked]=\"checkValidation(validator)\" (change)=\"changeValidations($event.checked, validator)\">\n                    {{validator}}\n                </md-checkbox>\n                <div *ngIf=\"checkValidation(validator)\" style=\"margin-left: 30px;\">\n                        <input mdInput class=\"form-control full-width\" type=\"text\" name=\"validatorField_{{validator}}\" placeholder=\"Validator fields\" [(ngModel)]=\"validationFields[validator]\"\n                            (change)=\"changeType($event, 'validationFields', validator)\">\n                    <p style=\"color: red; margin-top: -10px;\" *ngIf=\"!validateFieldsValid\">Invalid JSON</p>\n                </div>\n            </div>\n        </div>\n        <div *ngIf=\"functions !== undefined\">\n            <p style=\"color: red\" *ngIf=\"functions && !functions.valid\">{{functions.message}}</p>\n        </div>\n        <div class=\"flex-container\" fxLayout=\"row\">\n            <div fxFlex></div>\n            <button class=\"form-button\" (click)=\"save()\" mdTooltip=\"update type\" aria-label=\"update type\" md-raised-button color=\"primary\"\n                [disabled]=\"functions && !functions.valid || !aggregateFieldsValid || !validateFieldsValid\">Update</button>\n        </div>\n    </div>\n</div>\n";
      /***/
    },

    /***/
    "Y7uA":
    /*!*******************************************!*\
      !*** ./src/app/types/types.component.css ***!
      \*******************************************/

    /*! exports provided: default */

    /***/
    function Y7uA(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.type-tile {\n    overflow: auto;\n}\n\n.type-edit-button {\n    position: absolute;\n    top: 20px;\n    right: 20px;\n}\n\n.type-title-buttons {\n    position: absolute;\n    top: 25px;\n    right: 25px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGVzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7O0FBRUY7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1QsV0FBVztBQUNmOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxXQUFXO0FBQ2YiLCJmaWxlIjoidHlwZXMuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNiBDcm93biBDb3B5cmlnaHRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLmZvcm0tcm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZmxvdzogcm93IHdyYXA7XG59XG5cbi50eXBlLXRpbGUge1xuICAgIG92ZXJmbG93OiBhdXRvO1xufVxuXG4udHlwZS1lZGl0LWJ1dHRvbiB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMjBweDtcbiAgICByaWdodDogMjBweDtcbn1cblxuLnR5cGUtdGl0bGUtYnV0dG9ucyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMjVweDtcbiAgICByaWdodDogMjVweDtcbn0iXX0= */";
      /***/
    },

    /***/
    "YXuy":
    /*!***************************************!*\
      !*** ./src/app/graph/graph.routes.ts ***!
      \***************************************/

    /*! exports provided: graphRoutes */

    /***/
    function YXuy(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "graphRoutes", function () {
        return graphRoutes;
      });
      /* harmony import */


      var _graph_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./graph.component */
      "k/13");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var graphRoutes = [{
        path: 'graph',
        component: _graph_component__WEBPACK_IMPORTED_MODULE_0__["GraphComponent"]
      }];
      /***/
    },

    /***/
    "YbjM":
    /*!*********************************************************!*\
      !*** ./src/app/graph/edge-form/edge-form.component.css ***!
      \*********************************************************/

    /*! exports provided: default */

    /***/
    function YbjM(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.input-field {\n    margin-right: 30px;\n}\n\n.form-button {\n    margin: 20px;\n    height: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkZ2UtZm9ybS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFlBQVk7SUFDWixZQUFZO0FBQ2hCIiwiZmlsZSI6ImVkZ2UtZm9ybS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE2IENyb3duIENvcHlyaWdodFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4uZm9ybS1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1mbG93OiByb3cgd3JhcDtcbn1cblxuLmlucHV0LWZpZWxkIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XG59XG5cbi5mb3JtLWJ1dHRvbiB7XG4gICAgbWFyZ2luOiAyMHB4O1xuICAgIGhlaWdodDogMzVweDtcbn0iXX0= */";
      /***/
    },

    /***/
    "ZAI4":
    /*!*******************************!*\
      !*** ./src/app/app.module.ts ***!
      \*******************************/

    /*! exports provided: AppModule */

    /***/
    function ZAI4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppModule", function () {
        return AppModule;
      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/platform-browser/animations */
      "R1ws");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/material/card */
      "Wp6s");
      /* harmony import */


      var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/material/toolbar */
      "/t3+");
      /* harmony import */


      var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/material/tabs */
      "wZkO");
      /* harmony import */


      var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! @angular/material/input */
      "qFsG");
      /* harmony import */


      var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! @angular/material/icon */
      "NFeN");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
      /*! @angular/flex-layout */
      "YUcS");
      /* harmony import */


      var _graph_graph_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
      /*! ./graph/graph.component */
      "k/13");
      /* harmony import */


      var _graph_edge_form_edge_form_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
      /*! ./graph/edge-form/edge-form.component */
      "LPyS");
      /* harmony import */


      var _graph_node_form_node_form_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
      /*! ./graph/node-form/node-form.component */
      "qs6J");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _schema_schema_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
      /*! ./schema/schema.component */
      "zvzT");
      /* harmony import */


      var _types_types_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
      /*! ./types/types.component */
      "ViYI");
      /* harmony import */


      var angular2_prettyjson__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
      /*! angular2-prettyjson */
      "e30H");
      /* harmony import */


      var _app_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
      /*! ./app.component */
      "Sy1n");
      /* harmony import */


      var _types_type_form_type_form_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(
      /*! ./types/type-form/type-form.component */
      "iX3w");
      /* harmony import */


      var _graph_entity_form_entity_form_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(
      /*! ./graph/entity-form/entity-form.component */
      "ddTy");
      /* harmony import */


      var _properties_properties_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(
      /*! ./properties/properties.component */
      "UumJ");
      /* harmony import */


      var _properties_property_form_property_form_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(
      /*! ./properties/property-form/property-form.component */
      "acSq");
      /* harmony import */


      var _app_routes__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(
      /*! ./app.routes */
      "RUEf");
      /* harmony import */


      var _ngx_config_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(
      /*! @ngx-config/core */
      "XRVh");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var AppModule = function AppModule() {
        _classCallCheck(this, AppModule);
      };

      AppModule = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_19__["AppComponent"], _graph_graph_component__WEBPACK_IMPORTED_MODULE_12__["GraphComponent"], _graph_edge_form_edge_form_component__WEBPACK_IMPORTED_MODULE_13__["EdgeFormComponent"], _graph_node_form_node_form_component__WEBPACK_IMPORTED_MODULE_14__["NodeFormComponent"], _schema_schema_component__WEBPACK_IMPORTED_MODULE_16__["SchemaComponent"], _types_types_component__WEBPACK_IMPORTED_MODULE_17__["TypesComponent"], _types_type_form_type_form_component__WEBPACK_IMPORTED_MODULE_20__["TypeFormComponent"], _graph_entity_form_entity_form_component__WEBPACK_IMPORTED_MODULE_21__["EntityFormComponent"], _properties_properties_component__WEBPACK_IMPORTED_MODULE_22__["PropertiesComponent"], _properties_property_form_property_form_component__WEBPACK_IMPORTED_MODULE_23__["PropertyFormComponent"], _app_component__WEBPACK_IMPORTED_MODULE_19__["NavLinkComponent"]],
        imports: [_angular_material_card__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_7__["MatInputModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__["MatIconModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__["MatTabsModule"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_5__["MatToolbarModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], angular2_prettyjson__WEBPACK_IMPORTED_MODULE_18__["PrettyJsonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _angular_flex_layout__WEBPACK_IMPORTED_MODULE_11__["FlexLayoutModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], ngx_webstorage__WEBPACK_IMPORTED_MODULE_15__["NgxWebstorageModule"].forRoot(), _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterModule"], _app_routes__WEBPACK_IMPORTED_MODULE_24__["routing"], _ngx_config_core__WEBPACK_IMPORTED_MODULE_25__["ConfigModule"].forRoot({
          provide: _ngx_config_core__WEBPACK_IMPORTED_MODULE_25__["ConfigLoader"],
          useFactory: _ngx_config_core__WEBPACK_IMPORTED_MODULE_25__["configFactory"]
        })],
        entryComponents: [_app_component__WEBPACK_IMPORTED_MODULE_19__["AppComponent"]],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_19__["AppComponent"]]
      })], AppModule);
      /***/
    },

    /***/
    "acSq":
    /*!*********************************************************************!*\
      !*** ./src/app/properties/property-form/property-form.component.ts ***!
      \*********************************************************************/

    /*! exports provided: PropertyFormComponent */

    /***/
    function acSq(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "PropertyFormComponent", function () {
        return PropertyFormComponent;
      });
      /* harmony import */


      var _raw_loader_property_form_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./property-form.component.html */
      "V8dP");
      /* harmony import */


      var _property_form_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./property-form.component.css */
      "mWcD");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ../../services/gaffer.service */
      "5yZJ");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! angular2-uuid */
      "o9EK");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_5__);
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var PropertyFormComponent = /*#__PURE__*/function () {
        function PropertyFormComponent(storage, gafferService) {
          _classCallCheck(this, PropertyFormComponent);

          this.storage = storage;
          this.gafferService = gafferService;
          this.holderChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        }

        _createClass(PropertyFormComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var storedTypes = this.storage.retrieve('types');

            if (storedTypes !== null) {
              this._storedTypes = storedTypes;
            } else {
              this.resetTypes();
            }
          }
        }, {
          key: "resetTypes",
          value: function resetTypes() {
            var _this6 = this;

            this.gafferService.getCommonTypes().subscribe(function (commonTypes) {
              return _this6.formatTypes(commonTypes.types);
            }, function (error) {
              return _this6.errorMessage = error;
            });
          }
        }, {
          key: "formatTypes",
          value: function formatTypes(commonTypes) {
            var _this7 = this;

            this._storedTypes = [];
            lodash__WEBPACK_IMPORTED_MODULE_6__["forEach"](commonTypes, function (type, key) {
              type.type = key;
              type.index = _this7._storedTypes.length;

              _this7._storedTypes.push(type);
            });
            this.storage.store('types', this._storedTypes);
          }
        }, {
          key: "addNewProperty",
          value: function addNewProperty() {
            var uuid = angular2_uuid__WEBPACK_IMPORTED_MODULE_5__["UUID"].UUID();

            if (!this._propertyHolder.properties) {
              this._propertyHolder.properties = [];
            }

            this._propertyHolder.properties.push({
              id: uuid,
              name: 'New Property',
              type: this._storedTypes[0].type || 'string'
            });
          }
        }, {
          key: "removeProperty",
          value: function removeProperty(propertyId) {
            this._propertyHolder.properties = lodash__WEBPACK_IMPORTED_MODULE_6__["filter"](this._propertyHolder.properties, function (property) {
              return property.id !== propertyId;
            });
          }
        }, {
          key: "save",
          value: function save() {
            this.holderChange.emit({
              value: this.propertyHolder
            });
          }
        }, {
          key: "propertyHolder",
          set: function set(propertyHolder) {
            this._propertyHolder = propertyHolder;
          },
          get: function get() {
            return this._propertyHolder;
          }
        }]);

        return PropertyFormComponent;
      }();

      PropertyFormComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]
        }];
      };

      PropertyFormComponent.propDecorators = {
        propertyHolder: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        holderChange: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"]
        }]
      };
      PropertyFormComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-property-form',
        template: _raw_loader_property_form_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]],
        styles: [_property_form_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]])], PropertyFormComponent);
      /***/
    },

    /***/
    "crnd":
    /*!**********************************************************!*\
      !*** ./src/$$_lazy_route_resource lazy namespace object ***!
      \**********************************************************/

    /*! no static exports found */

    /***/
    function crnd(module, exports) {
      function webpackEmptyAsyncContext(req) {
        // Here Promise.resolve().then() is used instead of new Promise() to prevent
        // uncaught exception popping up in devtools
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      webpackEmptyAsyncContext.keys = function () {
        return [];
      };

      webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
      module.exports = webpackEmptyAsyncContext;
      webpackEmptyAsyncContext.id = "crnd";
      /***/
    },

    /***/
    "ddTy":
    /*!************************************************************!*\
      !*** ./src/app/graph/entity-form/entity-form.component.ts ***!
      \************************************************************/

    /*! exports provided: EntityFormComponent */

    /***/
    function ddTy(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "EntityFormComponent", function () {
        return EntityFormComponent;
      });
      /* harmony import */


      var _raw_loader_entity_form_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./entity-form.component.html */
      "2bY6");
      /* harmony import */


      var _entity_form_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./entity-form.component.css */
      "DVaU");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! angular2-uuid */
      "o9EK");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_5__);
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var EntityFormComponent = /*#__PURE__*/function () {
        function EntityFormComponent(storage, formBuilder) {
          _classCallCheck(this, EntityFormComponent);

          this.storage = storage;
          this.formBuilder = formBuilder;
        }

        _createClass(EntityFormComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            this._storedTypes = this.storage.retrieve('types');
          }
        }, {
          key: "updateForm",
          value: function updateForm(entities) {
            var _this8 = this;

            var formObject = {};
            lodash__WEBPACK_IMPORTED_MODULE_6__["forEach"](entities, function (entity) {
              formObject[entity.id] = entity.name;
            });
            this.form = this.formBuilder.group(formObject);
            this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(function (data) {
              return _this8.save(data);
            });
          }
        }, {
          key: "addNewEntity",
          value: function addNewEntity() {
            var uuid = angular2_uuid__WEBPACK_IMPORTED_MODULE_5__["UUID"].UUID();
            this.entities.push({
              id: uuid,
              name: 'New Entity',
              properties: []
            });
            this.updateForm(this.entities);
            this.save(this.form._value);
          }
        }, {
          key: "removeEntity",
          value: function removeEntity(entityId) {
            this.entities = lodash__WEBPACK_IMPORTED_MODULE_6__["filter"](this.entities, function (entity) {
              return entity.id !== entityId;
            });
            this.updateForm(this.entities);
            this.save(this.form._value);
          }
        }, {
          key: "save",
          value: function save(data) {
            lodash__WEBPACK_IMPORTED_MODULE_6__["forEach"](this.entities, function (entity) {
              entity.name = data[entity.id];
            });
            this._node.entities = this.entities;

            this._nodes.update(this._node);

            this.storage.store('graphNodes', this._nodes);
          }
        }, {
          key: "nodes",
          set: function set(nodes) {
            this._nodes = nodes;
          },
          get: function get() {
            return this._nodes;
          }
        }, {
          key: "selectedNode",
          set: function set(selectedNode) {
            this._node = this._nodes.get(selectedNode);
            this.entities = this._node.entities || [];
            this.updateForm(this.entities);
          }
        }]);

        return EntityFormComponent;
      }();

      EntityFormComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]
        }];
      };

      EntityFormComponent.propDecorators = {
        nodes: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        selectedNode: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }]
      };
      EntityFormComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-entity-form',
        template: _raw_loader_entity_form_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]],
        styles: [_entity_form_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]])], EntityFormComponent);
      /***/
    },

    /***/
    "hNXZ":
    /*!************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/schema/schema.component.html ***!
      \************************************************************************************/

    /*! exports provided: default */

    /***/
    function hNXZ(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n<div style=\"padding: 15px;\" class=\"flex-container\" fxLayout=\"row\" fxLayoutAlign=\"center start\">\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n    <div fxFlex>\n        <div fxLayout=\"row\">\n            <div fxFlex style=\"margin-top: 15px;\">\n                <h5 style=\"color:green;\" *ngIf=\"validation && validation.valid\">\n                    <mat-icon>check</mat-icon>\n                    {{validation.message}}\n                </h5>\n                <h5 style=\"color:red;\" *ngIf=\"validation && !validation.valid\">\n                    <mat-icon>close</mat-icon>\n                    <span *ngIf=\"validation && validation.errors\">{{validation.errors}}</span>\n                    <span *ngIf=\"!validation || validation.errors\">Unknown validation error</span>\n                </h5>\n                <h5 style=\"color:red;\" *ngIf=\"errorMessage\">\n                    <mat-icon>close</mat-icon>\n                    <span>{{errorMessage}}</span>\n                </h5>\n            </div>\n            <div fxFlex>\n                <div fxFlex fxLayout=\"row\">\n                    <div fxFlex class=\"input-field\">\n                        <input mdInput class=\"form-control full-width\" type=\"text\" name=\"class\" placeholder=\"Gaffer schema URL: <url>/rest/v1/graph/schema\" mdTooltip=\"Gaffer schema URL: <url>/rest/v1/graph/schema\" [(ngModel)]=\"schemaUrl\"\n                            (ngModelChange)=\"schemaUrlChanged()\">\n                    </div>\n                    <button md-raised-button color=\"accent\" style=\"height: 40px; margin-top: 16px;\" (click)=\"loadFromUrl()\" mdTooltip=\"load schema from URL\"\n                        aria-label=\"load schema from URL\" class=\"button-spacing\">\n                        Load from URL\n                        </button>\n                        <button md-raised-button color=\"warn\" style=\"height: 40px; margin-top: 16px;\" (click)=\"clearSchema()\" mdTooltip=\"load schema from URL\"\n                            aria-label=\"load schema from URL\" class=\"button-spacing\">\n                            Clear schema\n                            </button>\n                </div>\n                <p style=\"color:red; margin-top: 0;\" *ngIf=\"errorMessageURL\">{{errorMessageURL}}</p>\n                <p style=\"color:green; margin-top: 0;\" *ngIf=\"successURL\">{{successURL}}</p>\n            </div>\n        </div>\n        <mat-card style=\"margin-bottom: 20px;\">\n            <div class=\"content-card-header\">\n                <mat-card-title>Elements</mat-card-title>\n                <div class=\"type-edit-button row\">\n                    <button mat-icon-button color=\"accent\" (click)=\"enableEditMode('elements')\" mdTooltip=\"edit elements\" aria-label=\"edit elements\"\n                        *ngIf=\"!editing.elements\" class=\"button-spacing\">\n                        <mat-icon>edit</mat-icon>\n                        </button>\n                        <a class=\"download-button\" [href]=\"sanitize(elementsDownload)\" download=\"elements.json\" mdTooltip=\"save to file\" aria-label=\"save to file\" *ngIf=\"!editing.elements\"><i class=\"material-icons left\">file_download</i></a>\n                </div>\n            </div>\n            <mat-card-content>\n                <pre [hidden]=\"editing.elements\" [innerHtml]=\"elements | prettyjson:4\"></pre>\n                <p style=\"color: red\" *ngIf=\"errors.elements\">{{errors.elements}}</p>\n                    <textarea mdInput class=\"full-width\" id=\"elementsTextArea\" value=\"{{elements | json:4}}\" [hidden]=\"!editing.elements\"></textarea>\n                <div class=\"flex-container\" fxLayout=\"row\" *ngIf=\"editing.elements\">\n                    <div fxFlex></div>\n                    <button class=\"form-button button-spacing\" (click)=\"updateElements(undefined)\" mdTooltip=\"update elements\" aria-label=\"update elements\"\n                        md-raised-button color=\"primary\">Update</button>\n                </div>\n            </mat-card-content>\n        </mat-card>\n\n        <mat-card style=\"margin-bottom: 20px;\">\n            <div class=\"content-card-header\">\n                <mat-card-title>Types</mat-card-title>\n                <div class=\"type-edit-button row\">\n                    <button mat-icon-button color=\"accent\" (click)=\"enableEditMode('types')\" mdTooltip=\"edit types\" aria-label=\"edit types\"\n                        *ngIf=\"!editing.types\" class=\"button-spacing\">\n                        <mat-icon>edit</mat-icon>\n                        </button>\n                        <a class=\"download-button\" [href]=\"sanitize(typesDownload)\" download=\"types.json\" mdTooltip=\"save to file\" aria-label=\"save to file\" *ngIf=\"!editing.types\"><i class=\"material-icons left\">file_download</i></a>\n                </div>\n            </div>\n            <mat-card-content>\n                <pre [hidden]=\"editing.types\" [innerHtml]=\"types | prettyjson:4\"></pre>\n                <p style=\"color: red\" *ngIf=\"errors.types\">{{errors.types}}</p>\n                    <textarea mdInput class=\"full-width\" id=\"typesTextArea\" value=\"{{types | json:4}}\" [hidden]=\"!editing.types\"></textarea>\n                <div class=\"flex-container\" fxLayout=\"row\" *ngIf=\"editing.types\">\n                    <div fxFlex></div>\n                    <button class=\"form-button button-spacing\" (click)=\"updateTypes(undefined)\" mdTooltip=\"update types\" aria-label=\"update types\"\n                        md-raised-button color=\"primary\">Update</button>\n                </div>\n            </mat-card-content>\n        </mat-card>\n    </div>\n    <div fxFlex=\"10%\" fxShow=\"true\" fxShow.sm=\"false\" fxShow.xs=\"false\"></div>\n</div>\n";
      /***/
    },

    /***/
    "iX3w":
    /*!********************************************************!*\
      !*** ./src/app/types/type-form/type-form.component.ts ***!
      \********************************************************/

    /*! exports provided: TypeFormComponent */

    /***/
    function iX3w(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "TypeFormComponent", function () {
        return TypeFormComponent;
      });
      /* harmony import */


      var _raw_loader_type_form_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./type-form.component.html */
      "X3I5");
      /* harmony import */


      var _type_form_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./type-form.component.css */
      "JiCe");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ../../services/gaffer.service */
      "5yZJ");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var TypeFormComponent = /*#__PURE__*/function () {
        function TypeFormComponent(storage, gafferService) {
          _classCallCheck(this, TypeFormComponent);

          this.storage = storage;
          this.gafferService = gafferService;
          this.typeChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        }

        _createClass(TypeFormComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {}
        }, {
          key: "getGafferFunctions",
          value: function getGafferFunctions(type, javaClass) {
            var _this9 = this;

            if (type !== undefined && javaClass !== undefined) {
              this.gafferService.getSimpleFunctions(type, javaClass).subscribe(function (functions) {
                return _this9.functions = functions;
              }, function (error) {
                return _this9.errorMessage = error;
              });
            } else {
              this.functions = undefined;
            }

            if (!this._type.aggregateFunction) {
              this._type.aggregateFunction = {};
            }
          }
        }, {
          key: "changeValidations",
          value: function changeValidations(checked, validator) {
            if (checked) {
              if (!this._type.validateFunctions) {
                this._type.validateFunctions = [];
              }

              this._type.validateFunctions.push({
                "class": validator
              });

              if (this.validationFields[validator] === undefined || this.validationFields[validator].length === 0) {
                this.validationFields[validator] = '{}';
              } else {
                this.changeType(this.validationFields[validator], 'validationFields', lodash__WEBPACK_IMPORTED_MODULE_5__["cloneDeep"](validator));
              }
            } else {
              for (var i = 0; i < this._type.validateFunctions.length; i++) {
                if (this._type.validateFunctions[i]["class"] === validator) {
                  this._type.validateFunctions.splice(i, 1);
                }
              }
            }
          }
        }, {
          key: "changeType",
          value: function changeType(value, key, secondaryKey) {
            if (key === 'aggregateFields') {
              if (this.aggregateFields && this._type.aggregateFunction !== null) {
                try {
                  var fieldsObject = JSON.parse(this.aggregateFields);
                  fieldsObject["class"] = this._type.aggregateFunction["class"];
                  this._type.aggregateFunction = fieldsObject;
                  this.aggregateFieldsValid = true;
                } catch (e) {
                  if (this._type.aggregateFunction !== null && this._type.aggregateFunction["class"] !== 'NULL') {
                    this.aggregateFieldsValid = false;
                  } else {
                    this.aggregateFieldsValid = true;
                  }
                }
              } else {
                this.aggregateFieldsValid = true;
              }
            } else if (key === 'validationFields') {
              try {
                var _fieldsObject = JSON.parse(this.validationFields[secondaryKey]);

                _fieldsObject["class"] = secondaryKey;

                for (var i = 0; i < this._type.validateFunctions.length; i++) {
                  if (this._type.validateFunctions[i]["class"] === secondaryKey) {
                    this._type.validateFunctions[i] = _fieldsObject;
                  }
                }

                this.validateFieldsValid = true;
              } catch (e) {
                if (this._type.validateFunctions && this._type.validateFunctions.length > 0) {
                  this.validateFieldsValid = false;
                } else {
                  this.validateFieldsValid = true;
                }
              }
            } else {
              if (!secondaryKey) {
                this._type[key] = value;
              } else {
                this._type[key] = {};
                this._type[key][secondaryKey] = value;
              }

              if (key === 'type' || key === 'class') {
                this.getGafferFunctions(this._type.type, this._type["class"]);
              }

              if (key === 'aggregateFunction' && value !== 'NULL') {
                this.changeType(this.aggregateFields, 'aggregateFields', undefined);
              }
            }

            if (this._type.aggregateFunction !== null && this._type.aggregateFunction["class"] !== 'NULL') {
              this.aggregateFieldsDisabled = false;
            } else {
              this.aggregateFieldsDisabled = true;
            }
          }
        }, {
          key: "checkValidation",
          value: function checkValidation(validator) {
            var result = false;

            if (this._type.validateFunctions) {
              this._type.validateFunctions.forEach(function (v) {
                if (v["class"] === validator) {
                  result = true;
                }
              });
            }

            return result;
          }
        }, {
          key: "save",
          value: function save() {
            this.typeChange.emit({
              value: this._type
            });
          }
        }, {
          key: "type",
          set: function set(type) {
            var _this10 = this;

            this._type = type;

            if (!this._type.node && this._type.aggregateFunction !== null && this._type.aggregateFunction !== undefined && this._type.aggregateFunction !== null && this._type.aggregateFunction["class"] !== 'NULL' && this._type.aggregateFunction !== {}) {
              this.aggregateFields = lodash__WEBPACK_IMPORTED_MODULE_5__["cloneDeep"](this._type.aggregateFunction);
              this.aggregateFields["class"] = undefined;
              this.aggregateFieldsDisabled = false;

              try {
                this.aggregateFields = JSON.stringify(this.aggregateFields);
                this.aggregateFieldsValid = true;
              } catch (e) {
                this.aggregateFieldsValid = false;
              }
            } else {
              this.aggregateFields = '';
              this.aggregateFieldsValid = true;
              this.aggregateFieldsDisabled = true;
            }

            this.validationFields = {};
            this.validateFieldsValid = true;

            if (this._type.validateFunctions && this._type.validateFunctions.length > 0) {
              var tempValidationFields = lodash__WEBPACK_IMPORTED_MODULE_5__["cloneDeep"](this._type.validateFunctions);
              lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"](tempValidationFields, function (field) {
                var vFields = lodash__WEBPACK_IMPORTED_MODULE_5__["cloneDeep"](field);
                vFields["class"] = undefined;
                _this10.validationFields[field["class"]] = JSON.stringify(vFields);
              });
            }

            this.getGafferFunctions(type.type, type["class"]);
          },
          get: function get() {
            return this._type;
          }
        }]);

        return TypeFormComponent;
      }();

      TypeFormComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]
        }];
      };

      TypeFormComponent.propDecorators = {
        type: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        typeChange: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"]
        }]
      };
      TypeFormComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-type-form',
        template: _raw_loader_type_form_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]],
        styles: [_type_form_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _services_gaffer_service__WEBPACK_IMPORTED_MODULE_4__["GafferService"]])], TypeFormComponent);
      /***/
    },

    /***/
    "k/13":
    /*!******************************************!*\
      !*** ./src/app/graph/graph.component.ts ***!
      \******************************************/

    /*! exports provided: GraphComponent */

    /***/
    function k13(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "GraphComponent", function () {
        return GraphComponent;
      });
      /* harmony import */


      var _raw_loader_graph_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./graph.component.html */
      "x1e+");
      /* harmony import */


      var _graph_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./graph.component.css */
      "F5e3");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var vis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! vis */
      "TycK");
      /* harmony import */


      var vis__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(vis__WEBPACK_IMPORTED_MODULE_3__);
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var GraphComponent = /*#__PURE__*/function () {
        function GraphComponent(storage) {
          _classCallCheck(this, GraphComponent);

          this.storage = storage;
        }

        _createClass(GraphComponent, [{
          key: "selectNode",
          value: function selectNode(params) {
            this.selectedNode = params.nodes[0];
          }
        }, {
          key: "deselectNode",
          value: function deselectNode() {
            this.selectedNode = undefined;
          }
        }, {
          key: "selectEdge",
          value: function selectEdge(params) {
            this.selectedEdge = params.edges[0];
          }
        }, {
          key: "deselectEdge",
          value: function deselectEdge() {
            this.selectedEdge = undefined;
          }
        }, {
          key: "saveNodes",
          value: function saveNodes(data, callback) {
            if (data.label === 'new') {
              data.label = 'node ' + (this.nodes.get().length + 1);
            }

            callback(data);
            this.storage.store('graphEdges', this.edges);
            this.storage.store('graphNodes', this.nodes);
          }
        }, {
          key: "saveEdges",
          value: function saveEdges(data, callback) {
            if (data.to !== undefined) {
              data.length = 200;
              data.arrows = 'to';

              if (data.label === undefined) {
                data.label = 'edge ' + (this.edges.get().length + 1);
              }
            }

            callback(data);
            this.storage.store('graphEdges', this.edges);
            this.storage.store('graphNodes', this.nodes);
          }
        }, {
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this11 = this;

            var storedNodes = this.storage.retrieve('graphNodes');

            if (storedNodes !== null) {
              var nodeArray = [];
              Object(lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"])(storedNodes._data, function (storedNode) {
                nodeArray.push(storedNode);
              });
              this.nodes = new vis__WEBPACK_IMPORTED_MODULE_3__["DataSet"](nodeArray);
            } else {
              this.nodes = new vis__WEBPACK_IMPORTED_MODULE_3__["DataSet"]();
            }

            var storedEdges = this.storage.retrieve('graphEdges');

            if (storedEdges !== null) {
              var edgeArray = [];
              Object(lodash__WEBPACK_IMPORTED_MODULE_5__["forEach"])(storedEdges._data, function (storedEdge) {
                edgeArray.push(storedEdge);
              });
              this.edges = new vis__WEBPACK_IMPORTED_MODULE_3__["DataSet"](edgeArray);
            } else {
              this.edges = new vis__WEBPACK_IMPORTED_MODULE_3__["DataSet"]();
            }

            this.container = document.getElementById('schema-graph');
            this.data = {
              nodes: this.nodes,
              edges: this.edges
            };
            this.options = {
              nodes: {
                shape: 'dot',
                size: 18,
                font: {
                  size: 16
                },
                borderWidth: 2,
                shadow: true
              },
              edges: {
                width: 2,
                shadow: true
              },
              autoResize: true,
              height: '600px',
              manipulation: {
                enabled: true,
                initiallyActive: true,
                addNode: function addNode(data, callback) {
                  return _this11.saveNodes(data, callback);
                },
                addEdge: function addEdge(data, callback) {
                  return _this11.saveEdges(data, callback);
                },
                editEdge: function editEdge(data, callback) {
                  return _this11.saveEdges(data, callback);
                },
                deleteNode: function deleteNode(data, callback) {
                  return _this11.saveNodes(data, callback);
                },
                deleteEdge: function deleteEdge(data, callback) {
                  return _this11.saveEdges(data, callback);
                },
                controlNodeStyle: {}
              }
            };
            this.network = new vis__WEBPACK_IMPORTED_MODULE_3__["Network"](this.container, this.data, this.options);
            this.network.on('selectNode', function (params) {
              return _this11.selectNode(params);
            });
            this.network.on('selectEdge', function (params) {
              return _this11.selectEdge(params);
            });
            this.network.on('deselectNode', function (params) {
              return _this11.deselectNode();
            });
            this.network.on('deselectEdge', function (params) {
              return _this11.deselectEdge();
            });
          }
        }]);

        return GraphComponent;
      }();

      GraphComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_4__["LocalStorageService"]
        }];
      };

      GraphComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-graph',
        template: _raw_loader_graph_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_graph_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_4__["LocalStorageService"]])], GraphComponent);
      /***/
    },

    /***/
    "kvz0":
    /*!*****************************************************!*\
      !*** ./src/app/properties/properties.component.css ***!
      \*****************************************************/

    /*! exports provided: default */

    /***/
    function kvz0(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.properties-tile {\n    overflow: auto;\n}\n\n.properties-edit-button {\n    position: absolute;\n    top: 20px;\n    right: 20px;\n}\n\n.properties-title-buttons {\n    position: absolute;\n    top: 25px;\n    right: 25px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3BlcnRpZXMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7QUFFRjtJQUNJLGFBQWE7SUFDYixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsU0FBUztJQUNULFdBQVc7QUFDZiIsImZpbGUiOiJwcm9wZXJ0aWVzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTYgQ3Jvd24gQ29weXJpZ2h0XG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi5mb3JtLXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xufVxuXG4ucHJvcGVydGllcy10aWxlIHtcbiAgICBvdmVyZmxvdzogYXV0bztcbn1cblxuLnByb3BlcnRpZXMtZWRpdC1idXR0b24ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDIwcHg7XG4gICAgcmlnaHQ6IDIwcHg7XG59XG5cbi5wcm9wZXJ0aWVzLXRpdGxlLWJ1dHRvbnMge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDI1cHg7XG4gICAgcmlnaHQ6IDI1cHg7XG59Il19 */";
      /***/
    },

    /***/
    "mWcD":
    /*!**********************************************************************!*\
      !*** ./src/app/properties/property-form/property-form.component.css ***!
      \**********************************************************************/

    /*! exports provided: default */

    /***/
    function mWcD(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9wZXJ0eS1mb3JtLmNvbXBvbmVudC5jc3MifQ== */";
      /***/
    },

    /***/
    "o2/h":
    /*!*********************************************************!*\
      !*** ./src/app/graph/node-form/node-form.component.css ***!
      \*********************************************************/

    /*! exports provided: default */

    /***/
    function o2H(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "/*\n * Copyright 2016 Crown Copyright\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n.form-row {\n    display: flex;\n    flex-flow: row wrap;\n}\n\n.input-field {\n    margin-right: 30px;\n}\n\n.form-button {\n    margin: 20px;\n    height: 35px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUtZm9ybS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFlBQVk7SUFDWixZQUFZO0FBQ2hCIiwiZmlsZSI6Im5vZGUtZm9ybS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE2IENyb3duIENvcHlyaWdodFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4uZm9ybS1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1mbG93OiByb3cgd3JhcDtcbn1cblxuLmlucHV0LWZpZWxkIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XG59XG5cbi5mb3JtLWJ1dHRvbiB7XG4gICAgbWFyZ2luOiAyMHB4O1xuICAgIGhlaWdodDogMzVweDtcbn0iXX0= */";
      /***/
    },

    /***/
    "pNCB":
    /*!***************************************!*\
      !*** ./src/app/types/types.routes.ts ***!
      \***************************************/

    /*! exports provided: typesRoutes */

    /***/
    function pNCB(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "typesRoutes", function () {
        return typesRoutes;
      });
      /* harmony import */


      var _types_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./types.component */
      "ViYI");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var typesRoutes = [{
        path: 'types',
        component: _types_component__WEBPACK_IMPORTED_MODULE_0__["TypesComponent"]
      } //   { path: 'explore/:id', component: ExploreComponent }
      ];
      /***/
    },

    /***/
    "qs6J":
    /*!********************************************************!*\
      !*** ./src/app/graph/node-form/node-form.component.ts ***!
      \********************************************************/

    /*! exports provided: NodeFormComponent */

    /***/
    function qs6J(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "NodeFormComponent", function () {
        return NodeFormComponent;
      });
      /* harmony import */


      var _raw_loader_node_form_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./node-form.component.html */
      "wKld");
      /* harmony import */


      var _node_form_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./node-form.component.css */
      "o2/h");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var NodeFormComponent = /*#__PURE__*/function () {
        function NodeFormComponent(storage, formBuilder) {
          _classCallCheck(this, NodeFormComponent);

          this.storage = storage;
          this.formBuilder = formBuilder;
        }

        _createClass(NodeFormComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this12 = this;

            this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(function (data) {
              return _this12.save(data);
            });
          }
        }, {
          key: "updateForm",
          value: function updateForm(node) {
            this.form = this.formBuilder.group({
              label: node.label
            });
          }
        }, {
          key: "save",
          value: function save(data) {
            this._node = lodash__WEBPACK_IMPORTED_MODULE_5__["merge"](this._node, data);

            this._nodes.update(this._node);

            this.storage.store('graphNodes', this._nodes);
          }
        }, {
          key: "nodes",
          set: function set(nodes) {
            this._nodes = nodes;
          },
          get: function get() {
            return this._nodes;
          }
        }, {
          key: "selectedNode",
          set: function set(selectedNode) {
            this._node = this._nodes.get(selectedNode);
            this.updateForm(this._node);
          }
        }, {
          key: "network",
          set: function set(network) {
            this._network = network;
          }
        }]);

        return NodeFormComponent;
      }();

      NodeFormComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]
        }, {
          type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]
        }];
      };

      NodeFormComponent.propDecorators = {
        nodes: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        selectedNode: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }],
        network: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }]
      };
      NodeFormComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-node-form',
        template: _raw_loader_node_form_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]],
        styles: [_node_form_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]])], NodeFormComponent);
      /***/
    },

    /***/
    "t+05":
    /*!*************************************************!*\
      !*** ./src/app/properties/properties.routes.ts ***!
      \*************************************************/

    /*! exports provided: propertiesRoutes */

    /***/
    function t05(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "propertiesRoutes", function () {
        return propertiesRoutes;
      });
      /* harmony import */


      var _properties_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./properties.component */
      "UumJ");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var propertiesRoutes = [{
        path: 'properties',
        component: _properties_component__WEBPACK_IMPORTED_MODULE_0__["PropertiesComponent"]
      }];
      /***/
    },

    /***/
    "wKld":
    /*!************************************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/graph/node-form/node-form.component.html ***!
      \************************************************************************************************/

    /*! exports provided: default */

    /***/
    function wKld(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n\n<form [formGroup]=\"form\" style=\"padding-top: 10px;\">\n    <div class=\"form-group\">\n        <div class=\"input-field\">\n            <input mdInput class=\"full-width\" placeholder=\"Node name\" formControlName=\"label\" name=\"label\">\n        </div>\n    </div>\n</form>\n";
      /***/
    },

    /***/
    "x1e+":
    /*!**********************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/graph/graph.component.html ***!
      \**********************************************************************************/

    /*! exports provided: default */

    /***/
    function x1e(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<!--\n  ~ Copyright 2016-2019 Crown Copyright\n  ~\n  ~ Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~ you may not use this file except in compliance with the License.\n  ~ You may obtain a copy of the License at\n  ~\n  ~     http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~ Unless required by applicable law or agreed to in writing, software\n  ~ distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~ See the License for the specific language governing permissions and\n  ~ limitations under the License.\n  -->\n<div class=\"flex-container alt-background\" fxLayout=\"row\" fxLayoutWrap=\"wrap\">\n    <div fxFlex=\"100%\" fxFlex.gt-md=\"70%\" style=\"padding: 10px;\">\n        <mat-card style=\"padding: 0;\">\n            <mat-card-content>\n                <div id=\"schema-graph\"></div>\n            </mat-card-content>\n        </mat-card>\n    </div>\n    <div fxFlex=\"100%\" fxFlex.gt-md=\"30%\" style=\"padding: 10px;\">\n        <mat-card style=\"margin: 70px 0 20px 0; overflow: auto\" *ngIf=\"selectedEdge && !selectedNode\">\n            <div class=\"content-card-header\">\n                <mat-card-title>Selected Edge</mat-card-title>\n            </div>\n            <mat-card-content>\n                <app-edge-form [selectedEdge]=\"selectedEdge\" [edges]=\"edges\" [nodes]=\"nodes\" [network]=\"network\"></app-edge-form>\n            </mat-card-content>\n        </mat-card>\n\n        <mat-card style=\"margin: 70px 0 20px 0; overflow: auto\" *ngIf=\"selectedNode\">\n            <div class=\"content-card-header\">\n                <mat-card-title>Selected Node</mat-card-title>\n            </div>\n            <mat-card-content>\n                <app-node-form [selectedNode]=\"selectedNode\" [nodes]=\"nodes\" [network]=\"network\"></app-node-form>\n            </mat-card-content>\n        </mat-card>\n\n        <mat-card style=\"margin: 20px 0 20px 0; overflow-y: auto\" *ngIf=\"selectedNode\">\n            <div class=\"content-card-header\">\n                <mat-card-title>Node Entities</mat-card-title>\n            </div>\n            <mat-card-content>\n                <app-entity-form [selectedNode]=\"selectedNode\" [nodes]=\"nodes\"></app-entity-form>\n            </mat-card-content>\n        </mat-card>\n\n        <mat-card style=\"margin: 70px 0 20px 0; overflow: auto\" *ngIf=\"!selectedNode && !selectedEdge\">\n            <div class=\"content-card-header\">\n                <mat-card-title>None Selected</mat-card-title>\n            </div>\n            <mat-card-content>\n                <p>Select a node or edge from the graph.</p>\n            </mat-card-content>\n        </mat-card>\n    </div>\n</div>\n";
      /***/
    },

    /***/
    "zUnb":
    /*!*********************!*\
      !*** ./src/main.ts ***!
      \*********************/

    /*! no exports provided */

    /***/
    function zUnb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony import */


      var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser-dynamic */
      "a3Wg");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./environments/environment */
      "AytR");
      /* harmony import */


      var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./app/app.module */
      "ZAI4");
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].production) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
      }

      Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_0__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"]);
      /***/
    },

    /***/
    "zvzT":
    /*!********************************************!*\
      !*** ./src/app/schema/schema.component.ts ***!
      \********************************************/

    /*! exports provided: SchemaComponent */

    /***/
    function zvzT(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "SchemaComponent", function () {
        return SchemaComponent;
      });
      /* harmony import */


      var _raw_loader_schema_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! raw-loader!./schema.component.html */
      "hNXZ");
      /* harmony import */


      var _schema_component_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./schema.component.css */
      "Mm4O");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var ngx_webstorage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ngx-webstorage */
      "e4Ts");
      /* harmony import */


      var _services_gaffer_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ../services/gaffer.service */
      "5yZJ");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! angular2-uuid */
      "o9EK");
      /* harmony import */


      var angular2_uuid__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_7__);
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! lodash */
      "LvDl");
      /* harmony import */


      var lodash__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_8__);
      /* harmony import */


      var vis__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! vis */
      "TycK");
      /* harmony import */


      var vis__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(vis__WEBPACK_IMPORTED_MODULE_9__);
      /* harmony import */


      var jquery__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! jquery */
      "EVdn");
      /* harmony import */


      var jquery__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_10__);
      /*
       * Copyright 2016 Crown Copyright
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */


      var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
          if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };

      var __metadata = undefined && undefined.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
      };

      var SchemaComponent = /*#__PURE__*/function () {
        function SchemaComponent(storage, gafferService, router, route, sanitizer) {
          _classCallCheck(this, SchemaComponent);

          this.storage = storage;
          this.gafferService = gafferService;
          this.router = router;
          this.route = route;
          this.sanitizer = sanitizer;
        }

        _createClass(SchemaComponent, [{
          key: "parseElements",
          value: function parseElements() {
            var _this13 = this;

            this.elements = {
              edges: {},
              entities: {}
            };

            if (this.schema.hasOwnProperty('edges')) {
              lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](this.schema.edges._data, function (edge) {
                var directed = 'true';

                if (edge.arrows !== 'to') {
                  directed = 'false';
                }

                var formattedEdge = {
                  source: _this13.nodesById[edge.from],
                  destination: _this13.nodesById[edge.to],
                  directed: directed,
                  properties: {}
                };
                lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](edge.properties, function (property) {
                  formattedEdge.properties[property.name] = property.type;
                });
                _this13.elements.edges[edge.label] = formattedEdge;
              });
            }

            if (this.schema.hasOwnProperty('nodes')) {
              lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](this.schema.nodes._data, function (node) {
                lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](node.entities, function (entity) {
                  var formattedEntity = {
                    vertex: node.label,
                    properties: {}
                  };
                  lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](entity.properties, function (property) {
                    formattedEntity.properties[property.name] = property.type;
                  });
                  _this13.elements.entities[entity.name] = formattedEntity;
                });
              });
            }

            this.elementsDownload = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.elements, null, 2));
          }
        }, {
          key: "parseTypes",
          value: function parseTypes() {
            var _this14 = this;

            this.types = {
              types: {}
            };

            if (this.schema.hasOwnProperty('types')) {
              lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](this.schema.types, function (type) {
                var formattedType = {
                  "class": type["class"] || 'java.lang.String',
                  validateFunctions: type.validateFunctions || undefined,
                  aggregateFunction: type.aggregateFunction || null,
                  serialiser: type.serialiser || null
                };

                if (formattedType.aggregateFunction && Object.keys(formattedType.aggregateFunction).length === 0) {
                  formattedType.aggregateFunction = null;
                }

                _this14.types.types[type.type] = formattedType;
              });
            }

            if (this.schema.hasOwnProperty('nodes')) {
              lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](this.schema.nodes._data, function (node) {
                var formattedNode = {
                  "class": node["class"] || 'java.lang.String',
                  validateFunctions: node.validateFunctions || undefined
                };
                _this14.types.types[node.label] = formattedNode;
              });
            }

            this.typesDownload = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.types, null, 2));
          }
        }, {
          key: "sanitize",
          value: function sanitize(url) {
            return this.sanitizer.bypassSecurityTrustUrl(url);
          }
        }, {
          key: "clearSchema",
          value: function clearSchema() {
            this.storage.clear();
            this.ngOnInit();
            this.elements = undefined;
            this.types = undefined;
          }
        }, {
          key: "enableEditMode",
          value: function enableEditMode(key) {
            this.editing[key] = true;
            jquery__WEBPACK_IMPORTED_MODULE_10__('#' + key + 'TextArea').trigger('input');
          }
        }, {
          key: "updateElements",
          value: function updateElements(input) {
            var editedText;

            if (input) {
              editedText = input;
            } else {
              try {
                editedText = JSON.parse(jquery__WEBPACK_IMPORTED_MODULE_10__('#elementsTextArea').val().toString());
              } catch (e) {
                editedText = undefined;
                this.errors.elements = 'Failed to parse JSON: ' + e.message;
              }
            }

            if (editedText) {
              var edges = new vis__WEBPACK_IMPORTED_MODULE_9__["DataSet"]();
              var nodes = new vis__WEBPACK_IMPORTED_MODULE_9__["DataSet"]();
              var newNodes = [];
              var newEdges = [];
              this.errors.elements = undefined;

              if (editedText.edges) {
                lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](editedText.edges, function (editedEdge, edgeName) {
                  var fromId;
                  var toId;

                  if (!lodash__WEBPACK_IMPORTED_MODULE_8__["some"](newNodes, {
                    label: editedEdge.source
                  })) {
                    fromId = angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID();
                    newNodes.push({
                      id: fromId,
                      entities: [],
                      label: editedEdge.source
                    });
                  } else {
                    fromId = lodash__WEBPACK_IMPORTED_MODULE_8__["find"](newNodes, {
                      label: editedEdge.source
                    }).id;
                  }

                  if (!lodash__WEBPACK_IMPORTED_MODULE_8__["some"](newNodes, {
                    label: editedEdge.destination
                  })) {
                    toId = angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID();
                    newNodes.push({
                      id: toId,
                      entities: [],
                      label: editedEdge.destination
                    });
                  } else {
                    toId = lodash__WEBPACK_IMPORTED_MODULE_8__["find"](newNodes, {
                      label: editedEdge.destination
                    }).id;
                  }

                  var props = [];
                  lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](editedEdge.properties, function (value, name) {
                    props.push({
                      id: angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID(),
                      name: name,
                      type: value
                    });
                  });
                  newEdges.push({
                    id: angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID(),
                    from: fromId,
                    label: edgeName,
                    properties: props,
                    length: 200,
                    arrows: 'to',
                    to: toId
                  });
                });
              }

              if (editedText.entities) {
                lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](editedText.entities, function (editedEntity, entityName) {
                  var nodeId;
                  var props = [];
                  lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](editedEntity.properties, function (value, name) {
                    props.push({
                      id: angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID(),
                      name: name,
                      type: value
                    });
                  });

                  if (!lodash__WEBPACK_IMPORTED_MODULE_8__["some"](newNodes, {
                    label: editedEntity.vertex
                  })) {
                    nodeId = angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID();
                    var newNode = {
                      id: nodeId,
                      entities: [],
                      label: editedEntity.vertex
                    };
                    newNode.entities.push({
                      id: angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID(),
                      name: entityName,
                      properties: props
                    });
                    newNodes.push(newNode);
                  } else {
                    lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](newNodes, function (node) {
                      if (node.label === editedEntity.vertex) {
                        node.entities.push({
                          id: angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID(),
                          name: entityName,
                          properties: props
                        });
                      }
                    });
                  }
                });
              }

              nodes.add(newNodes);
              edges.add(newEdges);
              this.storage.store('graphNodes', nodes);
              this.storage.store('graphEdges', edges);
              this.editing.elements = false;
              this.ngOnInit();
            }
          }
        }, {
          key: "updateTypes",
          value: function updateTypes(input) {
            var editedText;

            if (input) {
              editedText = input;
            } else {
              try {
                editedText = JSON.parse(jquery__WEBPACK_IMPORTED_MODULE_10__('#typesTextArea').val().toString());
              } catch (e) {
                editedText = undefined;
                this.errors.types = 'Failed to parse JSON: ' + e.message;
              }
            }

            if (editedText) {
              var storedNodes = this.storage.retrieve('graphNodes');
              var newTypes = [];

              if (editedText.types) {
                lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](editedText.types, function (editedType, typeName) {
                  var found = false;
                  lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](storedNodes._data, function (storedNode, storedId) {
                    if (storedNode.label === typeName) {
                      storedNode["class"] = editedType["class"];
                      storedNode.validateFunctions = editedText.validateFunctions;
                      found = true;
                    }
                  });

                  if (!found) {
                    newTypes.push({
                      "class": editedType["class"],
                      type: typeName,
                      validateFunctions: editedType.validateFunctions
                    });
                  }
                });
                this.storage.store('graphNodes', storedNodes);
                this.storage.store('types', newTypes);
                this.editing.types = false;
              }
            }
          }
        }, {
          key: "setupNodeLookups",
          value: function setupNodeLookups() {
            var nodesById = {};
            var storedNodes = this.storage.retrieve('graphNodes');

            if (storedNodes) {
              lodash__WEBPACK_IMPORTED_MODULE_8__["forEach"](storedNodes._data, function (storedNode, storedId) {
                nodesById[storedId] = storedNode.label;
              });
            }

            this.nodesById = nodesById;
          }
        }, {
          key: "loadFromUrl",
          value: function loadFromUrl() {
            var _this15 = this;

            this.successURL = undefined;
            this.gafferService.getSchemaFromURL(this.schemaUrl).subscribe(function (result) {
              return _this15.formatSchemaResult(result);
            }, function (error) {
              return _this15.errorMessageURL = error;
            });
          }
        }, {
          key: "schemaUrlChanged",
          value: function schemaUrlChanged() {
            if (this.schemaUrl.length === 0) {
              this.storage.clear('schemaURL');
              this.router.navigate(['/schema']);
            }
          }
        }, {
          key: "formatSchemaResult",
          value: function formatSchemaResult(result) {
            this.errorMessageURL = undefined;
            this.errorMessage = undefined;
            this.router.navigate(['/schema', {
              url: this.schemaUrl
            }]);

            if (result.hasOwnProperty('types') && result.hasOwnProperty('edges')) {
              this.updateElements(result);
              this.updateTypes(result);
            }

            this.successURL = 'Successfully loaded schema from URL';
          }
        }, {
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this16 = this;

            var storedNodes = this.storage.retrieve('graphNodes');
            var storedEdges = this.storage.retrieve('graphEdges');
            var storedTypes = this.storage.retrieve('types');
            this.schema = {
              nodes: storedNodes,
              edges: storedEdges,
              types: storedTypes
            };
            this.errors = {
              elements: undefined,
              types: undefined
            };
            this.editing = {
              elements: false,
              types: false
            };
            this.schemaUrl = '';
            this.route.params.subscribe(function (routeParams) {
              if (routeParams.hasOwnProperty('url')) {
                _this16.schemaUrl = routeParams.url;

                _this16.storage.store('schemaURL', routeParams.url);
              } else {
                var storedSchemaUrl = _this16.storage.retrieve('schemaURL');

                if (storedSchemaUrl && storedSchemaUrl !== null) {
                  _this16.schemaUrl = _this16.storage.retrieve('schemaURL');

                  _this16.router.navigate(['/schema', {
                    url: _this16.schemaUrl
                  }]);
                }
              }
            });
            this.setupNodeLookups();
            jquery__WEBPACK_IMPORTED_MODULE_10__('textarea').each(function () {
              this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;');
            }).on('input', function () {
              var _this17 = this;

              setTimeout(function () {
                _this17.style.height = _this17.scrollHeight + 'px';
              }, 100);
            });

            if (storedEdges !== null && storedNodes !== null) {
              this.parseElements();
              this.parseTypes();
              this.validation = undefined;
              this.errorMessage = undefined;
              this.gafferService.validateSchema(this.elements, this.types).subscribe(function (validation) {
                return _this16.validation = validation;
              }, function (error) {
                return _this16.errorMessage = error;
              });
            }
          }
        }]);

        return SchemaComponent;
      }();

      SchemaComponent.ctorParameters = function () {
        return [{
          type: ngx_webstorage__WEBPACK_IMPORTED_MODULE_5__["LocalStorageService"]
        }, {
          type: _services_gaffer_service__WEBPACK_IMPORTED_MODULE_6__["GafferService"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]
        }, {
          type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"]
        }];
      };

      SchemaComponent = __decorate([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
        selector: 'app-schema',
        template: _raw_loader_schema_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        providers: [_services_gaffer_service__WEBPACK_IMPORTED_MODULE_6__["GafferService"]],
        styles: [_schema_component_css__WEBPACK_IMPORTED_MODULE_1__["default"]]
      }), __metadata("design:paramtypes", [ngx_webstorage__WEBPACK_IMPORTED_MODULE_5__["LocalStorageService"], _services_gaffer_service__WEBPACK_IMPORTED_MODULE_6__["GafferService"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"]])], SchemaComponent);
      /***/
    }
  }, [[0, "runtime", "vendor"]]]);
})();
//# sourceMappingURL=main-es5.js.map