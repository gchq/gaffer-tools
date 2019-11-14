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