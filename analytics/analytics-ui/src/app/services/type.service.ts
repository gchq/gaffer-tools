/*
 * Copyright 2019 Crown Copyright
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

import { Injectable } from '@angular/core';
import { endsWith, startsWith } from 'lodash';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Observer, of } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable()
export class TypeService {
  types = null;

  unknownType = {
    fields: [
      {
        label: 'Value',
        type: 'text',
        class: 'java.lang.String'
      }
    ]
  };

  constructor(private http: HttpClient, private error: ErrorService) { }

  /**
   * Asynchronously gets the types from the config. The types will be saved until update is called to reduce number of http requests.
   */
  get = function() {
    if (this.types) {
      return of(this.types);
    } else if (!this.typesObservable) {
      this.typesObservable = new Observable((observer: Observer<string>) => {
        this.getTypes(true, observer);
      });
    }
    return this.typesObservable;
  };

  /** Get the types from the config */
  getTypes = function(loud, observer) {
    // Configure the http headers
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // Make the http request
    let queryUrl = 'http://localhost:4200' + '/assets/defaultConfig.json';
    if (!startsWith(queryUrl, 'http')) {
      queryUrl = 'http://' + queryUrl;
    }
    this.http.get(queryUrl, { headers: '{headers}' }).subscribe(
      // On success
      data => {
        this.types = data.types;
        observer.next(data.types);
      },
      // On error
      err => {
        if (loud) {
          this.error.handle(
            'Failed to load the config, see the console for details',
            null,
            err
          );
          observer.error(err);
        } else {
          observer.next(err);
        }
      }
    );
  };

  getShortValue = function(value) {
    if (
      typeof value === 'string' ||
      value instanceof String ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined
    ) {
      return value;
    }

    if (value.constructor === Array) {
      return this.listShortValue(value);
    } else if (Object.keys(value).length !== 1) {
      return this.defaultShortValue(value);
    }

    const typeClass = Object.keys(value)[0];
    const parts = value[typeClass]; // the value without the class prepended
    if (parts === undefined) {
      return '';
    }

    const type = this.getType(typeClass);

    if (type.custom) {
      return this.customShortValue(type.fields, parts);
    }

    if (!this.isKnown(typeClass)) {
      if (endsWith(typeClass, 'Map')) {
        return this.mapShortValue(parts);
      } else if (endsWith(typeClass, 'List') || endsWith(typeClass, 'Set')) {
        return this.listShortValue(parts);
      }
    }

    if (typeof parts === 'object') {
      return Object.keys(parts)
        .map(key => {
          const val = parts[key];
          return this.getShortValue(val);
        })
        .join('|');
    }

    return parts;
  };

  private getType = function(typeClass) {
    if (typeClass !== undefined && this.types[typeClass]) {
      return this.types[typeClass];
    }
    return this.unknownType;
  };

  isKnown = function(className) {
    const knownType = this.types[className];

    if (knownType) {
      return true;
    }

    return false;
  };

  defaultShortValue = value => {
    return JSON.stringify(value);
  }

  listShortValue = function(values) {
    return values
      .map(value => {
        return this.getShortValue(value);
      })
      .join(', ');
  };

  private mapShortValue = function(value) {
    return Object.keys(value)
      .map(key => {
        return key + ': ' + this.getShortValue(value[key]);
      })
      .join(', ');
  };

  private customShortValue = function(fields, parts) {
    const showWithLabel = fields.length !== 1;

    return fields
      .map(field => {
        const layers = field.key.split('.');
        let customValue = parts;
        for (const layer of layers) {
          customValue = customValue[layer];
        }

        customValue = this.getShortValue(customValue);

        if (showWithLabel) {
          return field.label + ': ' + customValue;
        }
        return customValue;
      })
      .join(', ');
  };
}
