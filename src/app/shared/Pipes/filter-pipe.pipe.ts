import { Pipe, PipeTransform } from '@angular/core';
import {Post} from '../../../environments/interface';
import {AuthService} from '../services/auth.service';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipePipe implements PipeTransform {

  transform(posts: Post[], commentSelect: string[], direSelect?: string[], timeSelect?: string, adminSelect?: string[], authorSelect?: string[] ): Post[] {
    let resArr: Post[] = posts;
    const filterTrigger: string[] = [];
    const day = 86400000;
    const week = 604800000;
    const msInMonth = (33 - new Date(new Date().getFullYear(), new Date().getMonth(), 33).getDate()) * day;
    pushTrigger(commentSelect, filterTrigger, direSelect, timeSelect, adminSelect, authorSelect);
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
        if (direSelect) {
          direSelect.forEach(dir => resArr = filterDir(resArr, dir));
        }
        if (trigger === 'Per day') {
          resArr = timeFilter(resArr, day);
        }
        if (trigger === 'Per week') {
          resArr = timeFilter(resArr, week);
        }
        if (trigger === 'Per month') {
          resArr = timeFilter(resArr, msInMonth);
        }
        if (adminSelect) {
          adminSelect.forEach(adm => resArr = filterAdmin(resArr, adm));
        }
        if (authorSelect) {
          authorSelect.forEach((tr) => resArr = filterAuthor(resArr, tr));
        }
      });
    }
    return resArr;
  }
}

function filterAuthor(arr: Post[], trigger: string): Post[] {
    if (trigger === 'My questions') {
      arr = arr.filter( post => localStorage.getItem('user-email') === post.author);
    }
    return arr;
}
function filterAdmin(arr: Post[], trigger: string): Post[] {
  if (trigger === 'On moderation') {
    arr = arr.filter(post => {
      if (post.adminApprove === false) {
        return true;
      }
    });
  }
  return arr;
}
function timeFilter(arr: Post[], time: number): Post[] {
      const dateNow = new Date().getTime();
      arr = arr.filter(post => {
        if ((dateNow - post.date) < time) {
          return true;
        }
      });
      return arr;
}
function filterDir(arr: Post[], trigger: string): Post[] {
    arr = arr.filter(post => {
      if (post.direct.includes(trigger)) {
        return true;
      }
    });
    return arr;
}
function pushTrigger(commentSelect: string[], filterTrigger: string[], direSelect: string[], timeSelect: string, adminSelect: string[], authorSelect: string[]): string[] {
  if (commentSelect || direSelect || timeSelect || adminSelect || authorSelect) {
    if (commentSelect) {
      commentSelect.forEach(com => filterTrigger.push(com));
    }
    if (direSelect) {
      direSelect.forEach(dir => filterTrigger.push(dir));
    }
    if (timeSelect) {
      filterTrigger.push(timeSelect);
    }
    if (adminSelect) {
      adminSelect.forEach(adm => filterTrigger.push(adm));
    }
    if (authorSelect) {
      authorSelect.forEach((author => filterTrigger.push(author)));
    }
    return filterTrigger;
  }
  return filterTrigger;
}





