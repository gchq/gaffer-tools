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
import { isEqual, cloneDeep } from "lodash";

/**
 * Library of common code - used for compatability with certain browsers and to reduce
 * code duplication.
 */
export class CommonService {
  /**
   * Checks whether a string starts with a given prefix
   * @param {String} str The string to test
   * @param {String} prefix The prefix you want to check against
   */
  startsWith = function(str, prefix) {
    // to support ES5
    return str.indexOf(prefix) === 0;
  };

  /**
   * Appends http:// to a url if not specified. This will not
   * overwrite if a user specifies they want to use https
   * @param {String} url
   */
  parseUrl = function(url) {
    if (!this.startsWith(url, "http")) {
      url = "http://" + url;
    }

    return url;
  };

  /**
   * Checks whether an object is contained within an array.
   * This is not fast and if possible, use the arrayContainsObjectWithValue or
   * arrayContainsValue if you know a property that can be used as a key
   * or if the value is not an object
   * @param {Array} arr
   * @param {Object} obj
   */
  arrayContainsObject = function(arr, obj) {
    if (!arr || !obj) {
      return false;
    }
    for (var i in arr) {
      if (isEqual(arr[i], obj)) {
        return true;
      }
    }
    return false;
  };
}
