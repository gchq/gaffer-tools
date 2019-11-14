import { Pipe, PipeTransform } from '@angular/core';
class analytic {
    analyticName: string;
}

@Pipe({
    name: 'analyticFilter'
})
export class AnalyticFilterPipe implements PipeTransform {
    transform(items: analytic[], searchText: string): analytic[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.analyticName.toLowerCase().includes(searchText);
        });
    }
}
