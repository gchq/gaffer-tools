import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostService {
  constructor(private http: Http) {}

  search(terms: Observable<string>, debounceDuration = 400) {
    return terms.debounceTime(debounceDuration)
          .distinctUntilChanged()
          .switchMap(term => this.rawSearch(term));
  }

  rawSearch (term: string) {
    let redditUrl = 'https://www.reddit.com/r/pics/search.json';
    let params = new URLSearchParams();
    params.set('q', term);
    params.set('sort', 'new');
    params.set('restrict_sr', 'on');
    let options = new RequestOptions({
      search: params
    });
    // TODO: Add error handling
    return this.http.get(redditUrl, options)
          .map(res => res.json().data.children);
  }
}
