/*
 * Copyright 2019-2020 Crown Copyright
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

import { AnalyticFilterPipe } from './analytic-filter.pipe';

describe('AnalyticFilterPipe', () => {
    let analyticFilterPipe: AnalyticFilterPipe;

    // synchronous beforeEach
    beforeEach(() => {
        analyticFilterPipe = new AnalyticFilterPipe();
    });

    it('should be instanciated', () => {
        expect(analyticFilterPipe).toBeDefined();
    });

    it('should return empty array if no items given', () => {
        const items = null;

        const filtered = analyticFilterPipe.transform(items, 'Hans');

        expect(filtered.length).toBe(0);
        expect(filtered).toEqual([]);
    });

    it('should return items if no value is given', () => {
        const items = [];
        items.push({ id: 1, analyticName: 'Hans' });

        const filtered = analyticFilterPipe.transform(items, null);

        expect(filtered).toEqual(items);
    });

    it('should filter correctly', () => {
        const items = [];

        items.push({ id: 1, analyticName: 'Hans' });
        items.push({ id: 2, analyticName: 'Franz' });
        items.push({ id: 3, analyticName: 'Kurt' });
        items.push({ id: 4, analyticName: 'Gustav' });

        const filtered = analyticFilterPipe.transform(items, 'Hans');

        expect(filtered.length).toBe(1);
    });

    it('should filter two items', () => {
        const items = [];

        items.push({ id: 1, analyticName: 'Hans' });
        items.push({ id: 2, analyticName: 'Hans' });
        items.push({ id: 3, analyticName: 'Kurt' });
        items.push({ id: 4, analyticName: 'Gustav' });

        const filtered = analyticFilterPipe.transform(items, 'Hans');

        expect(filtered.length).toBe(2);
    });
});
