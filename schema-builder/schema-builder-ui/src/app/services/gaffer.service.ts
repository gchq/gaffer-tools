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

import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from 'ng2-config';

@Injectable()
export class GafferService {

  GAFFER_HOST: string = this.config.getSettings('system', 'gafferUrl');

  constructor(private http: Http, private config: ConfigService) { }

  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  getCommonTypes(): Observable<any> {
    const gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/commonSchema';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(gafferUrl, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  getSimpleFunctions(typeName: string, typeClass: string): Observable<any> {
    const gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/functions';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const params = {
      typeName: typeName,
      typeClass: typeClass
    };
    return this.http.post(gafferUrl, params, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  validateSchema(elements: any, types: any): Observable<any> {
    const gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/validate';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const params = [elements, types];
    return this.http.post(gafferUrl, params, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  getSchemaFromURL(url) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
          .map(this.extractData)
          .catch(this.handleError);
  }
}
