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
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@ngx-config/core';

@Injectable()
export class GafferService {

  GAFFER_HOST: string = this.config.getSettings('system', 'gafferUrl');

  constructor(private http: HttpClient, private config: ConfigService) { }

  private extractData(res: HttpResponse<any>) {
    const body = res.body;
    return body || { };
  }

  private handleError (error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      const body = error.error || '';
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.get(gafferUrl, options);
  }

  getSimpleFunctions(typeName: string, typeClass: string): Observable<any> {
    const gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/functions';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = {
      typeName: typeName,
      typeClass: typeClass
    };
    const options = { headers: headers, params: params };
    return this.http.post(gafferUrl, options);
  }

  validateSchema(elements: any, types: any): Observable<any> {
    const gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/validate';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = [elements, types];
    const options = { headers: headers, params: params};
    return this.http.post(gafferUrl, options);
  }

  getSchemaFromURL(url) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.get(url, options);
  }
}
