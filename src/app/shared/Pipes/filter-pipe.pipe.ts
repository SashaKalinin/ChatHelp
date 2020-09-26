import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(posts: Post[], commentSelect: string[], direSelect?: string[], timeSelect?: string ): Post[] {
    let resArr: Post[] = posts;
    const filterTrigger: string[] = [];
    pushTrigger(commentSelect, filterTrigger, direSelect, timeSelect);
    if (posts.length === 0 || filterTrigger.length === 0) {
      return posts;
    }
    if (resArr) {
      filterTrigger.forEach(trigger => {
        if (trigger === 'Comments') {
          resArr = resArr.filter( post => post.answers);
        }
        if (trigger === 'Answered') {
          resArr = resArr.filter( post => post.complete);
        }
        if (trigger === 'Frontend') {
          resArr = filterDir(resArr, trigger);
        }
        if (trigger === '.NET') {
          resArr = filterDir(resArr, trigger);
        }
        if (trigger === 'Salesforce') {
          resArr = filterDir(resArr, trigger);
        }
        if (trigger === 'Per day') {
          resArr = perDay(resArr);
        }
        if (trigger === 'Per week') {
          resArr = perWeek(resArr);
        }
        if (trigger === 'Per month') {
          resArr = perMonth(resArr);
        }
      });
    }
    return resArr;
  }
}

function perDay(arr: Post[]): Post[] {
      arr = arr.filter(post => {
        const day = 86400000;
        const dateNow = new Date().getTime();
        if ((dateNow - post.date) < day) {
          return post;
        }
      });
      return arr;
}
function perWeek(arr: Post[]): Post[] {
    arr = arr.filter(post => {
      const week = 604800000;
      const dateNow = new Date().getTime();
      if ((dateNow - post.date) < week) {
        return post;
      }
    });
    return arr;
}
function perMonth(arr: Post[]): Post[] {
    arr = arr.filter(post => {
      const msInMonth = (33 - new Date(new Date().getFullYear(), new Date().getMonth(), 33).getDate()) * 86400000;
      const dateNow = new Date().getTime();
      if ((dateNow - post.date) < msInMonth) {
        return post;
      }
    });
    return arr;
}
function filterDir(arr: Post[], trigger: string): Post[] {
    arr = arr.filter(post => {
      let flag = false;
      post.direct.forEach(dir => dir === trigger ? flag = true : flag);
      if (flag) {
        return post;
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





