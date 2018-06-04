import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datePipe' })

export class DatePipe implements PipeTransform {
    transform(value: string): string {
        return value.slice(8, 10) + '/' + value.slice(5, 7) + '/' + value.slice(0, 4);
    }
}