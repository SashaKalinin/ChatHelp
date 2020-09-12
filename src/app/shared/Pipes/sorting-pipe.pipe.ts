import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';

@Pipe({
  name: 'sortingPipe'
})
export class SortingPipePipe implements PipeTransform {

  transform(posts: Post[], isDes?: boolean): Post[] {
    if (posts.length === 0) {
      return posts;
    }
    if (isDes === true) {
      posts.sort((a, b) => {
        return a.date - b.date;
      });
    } else if (isDes === false) {
      posts.sort((a, b) => {
        return b.date - a.date;
      });
    } else {
      return posts ;
    }
    return  posts;
  }

}
