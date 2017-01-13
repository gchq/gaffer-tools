import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GafferService {

  GAFFER_HOST = 'http://localhost:8080';

  constructor(private http: Http) { }

  private extractData(res: Response) {
    let body = res.json();
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
    let gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/commonSchema';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(gafferUrl, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  getSimpleFunctions(typeName: string, typeClass: string): Observable<any> {
    let gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/functions';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = {
      typeName: typeName,
      typeClass: typeClass
    };
    return this.http.post(gafferUrl, params, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  validateSchema(dataSchema: any, dataTypes: any, storeTypes: any): Observable<any> {
    let gafferUrl = this.GAFFER_HOST + '/schema-builder-rest/v1/validate';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = [dataSchema, dataTypes, storeTypes];
    return this.http.post(gafferUrl, params, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  getSchemaFromURL(url) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
          .map(this.extractData)
          .catch(this.handleError);
  }
}
