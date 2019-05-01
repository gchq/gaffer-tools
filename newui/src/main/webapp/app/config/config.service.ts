/*
 * Copyright 2017-2019 Crown Copyright
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
import { Observable, Observer, of } from "rxjs";
import { merge } from "lodash";

import { Injectable} from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { DefaultRestEndpointService } from './default-rest-endpoint-service';

@Injectable()
export class ConfigService {
  config;
  defer = null;

  constructor(private http: HttpClient,
              private defaultRestEndpoint: DefaultRestEndpointService) {}

  get = function() {
    if (this.config) {
      return of(this.config);
    } else if (!this.configObservable) {
      this.configObservable = Observable.create(
        (observer: Observer<String>) => {this.load(observer);}
      );
    }

    return this.configObservable;
  };

  set = function(conf) {
    this.config = conf;
  };

  private load = function(observer) {
    this.http.get("http://localhost:8080/config/defaultConfig.json").subscribe(
      (response) => {
        var defaultConfig = response.data;
        if (defaultConfig === undefined) {
          defaultConfig = {};
        }
        var mergedConfig = defaultConfig;
        this.http.get("http://localhost:8080/config/config.json").subscribe(
          (response) => {
            var customConfig = response.data;

            if (customConfig === undefined) {
              customConfig = {};
            }
            if (!mergedConfig.restEndpoint && !customConfig.restEndpoint) {
              mergedConfig.restEndpoint = this.defaultRestEndpoint.get();
            }
            if ("types" in mergedConfig && "types" in customConfig) {
              merge(mergedConfig["types"], customConfig["types"]);
              delete customConfig["types"];
            }
            if ("operations" in mergedConfig && "operations" in customConfig) {
              merge(mergedConfig["operations"], customConfig["operations"]);
              delete customConfig["operations"];
            }
            merge(mergedConfig, customConfig);
            this.config = mergedConfig;
            observer.next(this.config);
          },
          (err) => {
            observer.error(err);
            this.error.handle("Failed to load custom config", null, err);
          }
        );
      },
      (err) => {
        observer.error(err);
        this.error.handle("Failed to load config", null, err);
      }
    );
  };
}
