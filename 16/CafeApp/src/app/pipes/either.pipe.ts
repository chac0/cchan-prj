import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'either'
})
export class EitherPipe implements PipeTransform {

  transform(isTrue: boolean, left: string, right: string): string {
    return isTrue ? right: left
  }

}
