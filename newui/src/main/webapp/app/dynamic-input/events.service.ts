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

  //Add a listener to an event
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

  //Fire an event and execute all the functions provided by listeners
  broadcast = function(eventName, args) {
    let listeners = this.events[eventName];
    let fn;
    for (let i in listeners) {
      fn = listeners[i];
      fn.apply(fn, args);
    }
  };

  //Stop listening to the given event
  unsubscribe = function(eventName, callback) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName] = this.events[eventName].filter(function(fn) {
      if (fn !== callback) {
        return fn;
      }
    });
  };
}
