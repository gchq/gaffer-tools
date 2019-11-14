import { Pipe, PipeTransform } from '@angular/core';
class Analytic {
    analyticName: string;
}

@Pipe({
    name: 'analyticFilter'
})
export class AnalyticFilterPipe implements PipeTransform {
    transform(items: Analytic[], searchText: string): Analytic[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.analyticName.toLowerCase().includes(searchText);
        });
    }
}
