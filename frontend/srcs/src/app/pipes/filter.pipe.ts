import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'filter' })

export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    const result = [];
    for (const p of value) {
      if (p.login.indexOf(arg) > -1) {
        result.push(p);
      };
    };
    return result;
  }
}
