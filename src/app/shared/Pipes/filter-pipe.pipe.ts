import { Pipe, PipeTransform } from '@angular/core';
import {Post} from "../../../environments/interface";

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(posts: Post, answerFlag: boolean, filerTrigger: string ): Post[] {
    return null;
  }

}
