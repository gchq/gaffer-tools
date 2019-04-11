import { Component, OnInit } from "@angular/core";

/*
 * Copyright 2018-2019 Crown Copyright
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
@Component({
  selector: "app-options",
  templateUrl: "./options.component.html"
})
export class OptionsComponent implements OnInit {
  /**
   * A key value map containing operation option keys and searchterms used in the event that an admin want's to use
   * the autocomplete functionality.
   */
  searchTerms = {};

  /**
   * A key value map containing operation option keys and associated preset options. Used by the md-select
   * component when using remote options.
   */
  presets = {};
  events;
  model;
  config;
  option;

  constructor() {}

  /**
   * Initialisation method. Subscribes to the "onPreExecute" event so that the master can update operation options before
   * an operation is executed. Then if no model is defined, it retrieves the default from the operationOptions service.
   * If not yet defined, it looks to the UI config to determine the defaults.
   */
  ngOnInit() {
    this.events.subscribe("onPreExecute", this.saveToService);
    if (!this.model) {
      // If the model is not yet defined, it must get the default from somewhere.
      var currentDefaults = null;
      //  operationOptions.getDefaultConfiguration();
      if (currentDefaults !== null) {
        // null implies not set.
        this.model = currentDefaults;
        return;
      }
      // If the defaults are not yet set by the user, the component looks to the config to get the default operation options
      this.config.get().then(function(conf) {
        this.model = this.angular.copy(conf.operationOptions);
        if (this.model) {
          if (this.model.visible === undefined) {
            this.model.visible = [];
          }
          if (this.model.hidden === undefined) {
            this.model.hidden = [];
          }

          for (var visibleOrHidden in this.model) {
            for (var i in this.model[visibleOrHidden]) {
              var option = this.model[visibleOrHidden][i];
              if (option.value) {
                if (option.multiple && !Array.isArray(option.value)) {
                  option.value = [option.value];
                }
                this.presets[option.key] = option.value;
              } else if (option.multiple) {
                option.value = [];
              }
            }
          }
        } else if (conf.operationOptionKeys) {
          console.warn(
            'UI "operationOptionKeys" config is deprecated. See the docs for the new options configuration.'
          );

          this.model = {
            visible: [],
            hidden: []
          };

          for (var label in conf.operationOptionKeys) {
            // var option = {
            //   key: conf.operationOptionKeys[label],
            //   label: label
            // };

            this.model.visible.push(option);
          }
        }
      });
    }
  }

  /**
   * Unsubscribes from the event service to avoid too many event subscriptions.
   */
  $onDestroy = function() {
    this.events.unsubscribe("onPreExecute", this.saveToService);
    this.saveToService();
  };

  private saveToService = function() {
    if (this.master) {
      // If master is being destroyed, for example when the user navigates away, the service is updated
      this.operationOptions.setDefaultConfiguration(this.model);
    }
  };

  /**
   * Sets the value of an operation option to undefined if it is a string or empty array if already an array.
   * @param {Number} index The index of the option in the visible array
   */
  clearValue = function(index) {
    var currentValue = this.model.visible[index].value;
    this.model.visible[index].value = Array.isArray(currentValue)
      ? []
      : undefined;
  };

  /**
   * Moves the operation option to the hidden array.
   * @param {Number} index The index of the option in the visible array
   */
  hideOption = function(index) {
    var optionCopy = this.angular.copy(this.model.visible[index]);
    this.model.hidden.push(optionCopy);
    this.model.visible.splice(index, 1);
  };

  /**
   * Moves the selected operation (created by the md-autocomplete component) from the hidden array to the visible array.
   */
  addOption = function() {
    if (this.selectedOption === undefined || this.selectedOption === null) {
      return;
    }
    if (!this.model.visible) {
      this.model.visible = [];
    }

    this.model.visible.push(this.angular.copy(this.selectedOption));

    this.model.hidden = this.model.hidden.filter(function(hiddenOption) {
      if (hiddenOption.key !== this.selectedOption.key) {
        return hiddenOption;
      }
    });

    this.selectedOption = undefined;
    this.search = "";
  };

  /**
   * Gets the available operation options. Used when operation options have preset values. It returns either a
   * promise of an array or an actual array (if they are static values set in the config).
   *
   * The values may be filtered using the searchTerm model.
   */
  getValues = function(option) {
    var searchTerm = this.searchTerms[option.key]
      ? this.searchTerms[option.key].toLowerCase()
      : this.searchTerms[option.key];

    if (option.autocomplete.options) {
      if (!searchTerm || searchTerm === "") {
        return option.autocomplete.options;
      } else {
        return option.autocomplete.options.filter(function(option) {
          if (option.toLowerCase().indexOf(searchTerm) !== -1) {
            return option;
          }
        });
      }
    } else if (option.autocomplete.asyncOptions) {
      var operation = option.autocomplete.asyncOptions;
      var deferredValues = this.$q.defer();

      this.query.execute(
        operation,
        function(values) {
          if (!searchTerm || searchTerm == "") {
            deferredValues.resolve(values);
            return;
          }
          var filteredValues = values.filter(function(value) {
            if (value.toLowerCase().indexOf(searchTerm) !== -1) {
              return value;
            }
          });
          deferredValues.resolve(filteredValues);
        },
        function(err) {
          this.error.handle("Failed to retrieve prepopulated options", err);
          deferredValues.resolve([]);
        }
      );

      return deferredValues.promise;
    } else {
      throw "Invalid operation options configuration. " +
        "Preset options must contain either static options or an operation to retrieve them";
    }
  };

  loadValues = function(option) {
    var deferred = this.$q.defer();

    this.getValues(option).then(function(resolvedValues) {
      this.presets[option.key] = resolvedValues;
      deferred.resolve();
    });

    return deferred.promise;
  };

  /**
   * Returns true if value is null, undefined or is an empty array.
   */
  isEmpty = function(value) {
    return value == undefined || (Array.isArray(value) && !value.length);
  };
}
