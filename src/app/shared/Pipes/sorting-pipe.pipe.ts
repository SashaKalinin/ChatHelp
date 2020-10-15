import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';

@Pipe({
  name: 'sortingPipe'
})
export class SortingPipePipe implements PipeTransform {

  transform(posts: Post[], isDesc?: boolean): Post[] {
    if (posts.length === 0) {
      return posts;
    }
    if (isDesc) {
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
