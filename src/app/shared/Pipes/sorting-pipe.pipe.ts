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
    if (isDes) {
      posts.sort((a, b) => {
        return a.date - b.date;
      });
    } else {
      posts.sort((a, b) => {
        return b.date - a.date;
      });
    }
    return  posts;
  }
}
