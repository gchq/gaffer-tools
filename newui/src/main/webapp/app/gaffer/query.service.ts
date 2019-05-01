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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ConfigService } from '../config/config.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { LoadingService } from '../loading/loading.service';
import { SettingsService } from '../settings/settings.service';
import { ResultsService } from './results.service';

@Injectable()
export class QueryService {

    constructor(private config: ConfigService,
                private common: CommonService,
                private error: ErrorService,
                private http: HttpClient,
                private loading: LoadingService,
                private settings: SettingsService,
                private results: ResultsService) {}

    /**
     * Alerts the user if they hit the result limit
     * @param {Array} data The data returned by the Gaffer REST service
     */
    private showTooManyResultsPrompt = function(data, onSuccess) {
        onSuccess(data);
        let resultLimit = this.settings.getResultLimit();
        this.error.handle('Too many results to show, showing only the first ' + resultLimit + ' rows',null,null);
    }

    /**
     * Executes a query. If too many results are returned a dialog is shown
     * to ask the user if they would like to view the results or amend their
     * query. On success, the result service is called to update the results.
     * @param {Object} The operation chain to execute. It can either be an object or a json string.
     */
    executeQuery = function(operation, onSuccess, onFailure) {
        this.execute(
            operation,
            //On success
            (data) => {
                this.loading.finish()
                //If there are too many results tell the user and only show a slice of the data
                if (data.length >= this.settings.getResultLimit()) {
                    this.showTooManyResultsPrompt(data.slice(0, this.settings.getResultLimit()), onSuccess);
                } else {
                   //Store these results and show them
                   this.results.update(data);
                   if(onSuccess) {
                       onSuccess(data);
                   }
                }
            },
            //On error
            (err) => {
                this.loading.finish();
                this.error.handle('Error executing operation', null, err);
                if (onFailure) {
                    onFailure(err);
                }
            }
        );
    }

    /**
     * Executes an operation and calls the onSuccess or onFailure functions provided.
     * @param {Object} The operation chain to execute. It can either be an object or a json string.
     */
    execute = function(operation, onSuccess, onFailure) {
        //Convert the operation to a json string
        if(typeof operation !== 'string' && !(operation instanceof String)) {
            operation = JSON.stringify(operation);
        }
        //Configure the http headers
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        //Get the config
        this.config.get().subscribe(
            //On success
            (conf) => {
                //Post the request to the server
                var queryUrl = this.common.parseUrl(conf.restEndpoint + "/graph/operations/execute");
                this.http.post(queryUrl, operation, { headers: headers} )
                    .subscribe(
                        //On success
                        (data) => {
                            if(onSuccess) {
                                onSuccess(data)
                            }
                        },
                        //On error
                        (err) => {
                            if (onFailure) {
                                onFailure(err);
                            } else {
                                this.error.handle('Error running operation, see the log for details', null, err);
                                console.error(err);
                            }
                        }
                    );
            },
            //On error
            (err) => {
                this.error.handle('Unable to load config, see the log for details', null, err);
                console.error(err);
            }
        );
    };
};
