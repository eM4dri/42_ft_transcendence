// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    const trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

//Pipe para truncar textos largos
//En el modulo que se quiera importar se debe de meter en declarations:[TruncatePipe]
//El uso en en un interpolado se le añade el pipe
//Ejemplo:
//text.text = "tocamelanariz"
//{{ text.text | truncate:[3] }} ---> toc...
