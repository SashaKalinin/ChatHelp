import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipePipe implements PipeTransform {

  transform(posts: Post[], commentSelect: string[], direSelect?: string[], timeSelect?: string ): Post[] {
    let resArr: Post[] = posts;
    const filterTrigger: string[] = [];
    const day = 86400000;
    const week = 604800000;
    const msInMonth = (33 - new Date(new Date().getFullYear(), new Date().getMonth(), 33).getDate()) * day;

    pushTrigger(commentSelect, filterTrigger, direSelect, timeSelect);
    if (posts.length === 0 || filterTrigger.length === 0) {
      return posts;
    }
    if (resArr) {
      filterTrigger.forEach(trigger => { // переделать массивы по одному
        if (trigger === 'Comments') {
          resArr = resArr.filter( post => post.answers);
        }
        if (trigger === 'Answered') {
          resArr = resArr.filter( post => post.complete);
        }
        if (direSelect) {
          direSelect.forEach(dir => resArr = filterDir(resArr, dir));
        }
        if (trigger === 'Per day') {
          resArr = timeFilter(resArr, day); //переделать как dir
        }
        if (trigger === 'Per week') {
          resArr = timeFilter(resArr, week);
        }
        if (trigger === 'Per month') {
          resArr = timeFilter(resArr, msInMonth);
        }
      });
    }
    return resArr;
  }
}

function timeFilter(arr: Post[], time: number): Post[] { //переписать легче
      const dateNow = new Date().getTime();
      arr = arr.filter(post => {
        if ((dateNow - post.date) < time) {
          return true;
        }
      });
      return arr;
}
function filterDir(arr: Post[], trigger: string): Post[] {  // исправить
    arr = arr.filter(post => {
      if (post.direct.includes(trigger)) {
        return true;
      }
    });
    return arr;
}
function pushTrigger(commentSelect: string[], filterTrigger: string[], direSelect: string[], timeSelect: string): string[] {
  if (commentSelect || direSelect || timeSelect) {
    if (commentSelect) {
      commentSelect.forEach(com => filterTrigger.push(com));
    }
    if (direSelect) {
      direSelect.forEach(dir => filterTrigger.push(dir));
    }
    if (timeSelect) {
      filterTrigger.push(timeSelect);
    }
    return filterTrigger;
  }
  return filterTrigger;
}





