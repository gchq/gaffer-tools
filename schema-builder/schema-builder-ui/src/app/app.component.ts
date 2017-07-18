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

import { Component, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

export interface RouteLink {
    title: string,
    route: string
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements AfterViewInit {
    activeLinkIndex: number;
    pages: Array<RouteLink> = [
        { title: 'Graph', route: 'graph' },
        { title: 'Properties', route: 'properties' },
        { title: 'Types', route: 'types' },
        { title: 'Schema', route: 'schema' }
    ];
    rlaSafe = false;

    public ngAfterViewInit() {
        this.rlaSafe = true;
    }

    activateLink(index: number, linkIsActivated: boolean) {
        this.activeLinkIndex = index;
        console.log(linkIsActivated);
    }

    constructor(private router: Router, private route: ActivatedRoute) {
    }
}

@Component({
    selector: 'app-nav-link',
    template: '{{_tabName}}'
})
export class NavLinkComponent {
    _tabName: string;
    @Input()
    set tabName(name: string) {
        this._tabName = name;
    }
}
