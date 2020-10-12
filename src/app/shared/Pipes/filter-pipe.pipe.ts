import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';
import {Constants} from '../../../environments/constants';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipePipe implements PipeTransform {
  transform(posts: Post[], commentSelect: string[], direSelect?: string[], timeSelect?: string, adminSelect?: string[], authorSelect?: string[] ): Post[] {
    let resArr: Post[] = posts;
    if (posts.length === 0 ) {
      return posts;
    }
    if (timeSelect) {
      resArr = time(resArr, timeSelect, Constants.day, Constants.week, Constants.msInMonth);
    }
    if (resArr) {
        if (commentSelect) {
          commentSelect.forEach( select => {
            if (select === 'Comments') {
              resArr = resArr.filter( post => post.answers);
            }else if (select === 'Answered'){
              resArr = resArr.filter( post => post.complete);
            }
          });
        }
        if (direSelect) {
          direSelect.forEach(dir => resArr = filterDir(resArr, dir));
        }
        if (adminSelect) {
          adminSelect.forEach(adm => resArr = filterAdmin(resArr, adm));
        }
        if (authorSelect) {
          authorSelect.forEach((tr) => resArr = filterAuthor(resArr, tr));
        }
    }
    return resArr;
  }
}
function time(arr: Post[], timeSelect: string, day: number, week: number, month: number): Post[] {
  switch (timeSelect) {
    case 'Per day':
      arr = timeFilter(arr, day);
      break;
    case 'Per week':
      arr = timeFilter(arr, week);
      break;
    case 'Per month':
      arr = timeFilter(arr, month);
      break;
  }
  return arr;
}
function filterAuthor(arr: Post[], trigger: string): Post[] {
    if (trigger === 'My questions') {
      arr = arr.filter( post => localStorage.getItem('user-email') === post.author);
    }
    return arr;
}
function filterAdmin(arr: Post[], trigger: string): Post[] {
  if (trigger === 'On moderation') {
    return arr.filter(post => !post.adminApprove);
  }
  return arr;
}
function timeFilter(arr: Post[], timing: number): Post[] {
    const dateNow = new Date().getTime();
    return arr.filter(post => (dateNow - post.date) < timing);
}
function filterDir(arr: Post[], trigger: string): Post[] {
    return arr.filter(post => post.direct.includes(trigger));
}





