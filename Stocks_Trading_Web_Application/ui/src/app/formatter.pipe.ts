import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatter'
})
export class FormatterPipe implements PipeTransform {
    transform(val: number): string {
        if (val !== undefined && val !== null) {
            return val.toFixed(2);
        } else {
            return '';
        }
    }
}
