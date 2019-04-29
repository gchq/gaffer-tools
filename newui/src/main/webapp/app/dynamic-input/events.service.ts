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
import { Injectable } from "@angular/core";
import { CommonService } from "./common.service";

@Injectable()
export class EventsService {
  events = {};

  constructor(private common: CommonService) {}

  subscribe = function(eventName, callback) {
    if (typeof callback !== "function") {
      return;
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (!this.common.arrayContainsObject(this.events[eventName], callback)) {
      this.events[eventName].push(callback);
    }
  };

  broadcast = function(eventName, args) {
    var listeners = this.events[eventName];
    var fn;
    for(var i in listeners) {
        fn = listeners[i];
        fn.apply(fn, args);
    }
  };
};
