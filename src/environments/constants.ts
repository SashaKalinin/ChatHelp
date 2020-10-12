
export class Constants {
   static day = 86400000;
   static week = 604800000;
   static msInMonth: number = (33 - new Date(new Date().getFullYear(), new Date().getMonth(), 33).getDate()) * 86400000;
   static dirArr: string[] = ['Frontend', '.NET', 'Salesforce'];
   static timeFilter: string[] = ['Per day', 'Per week', 'Per month'];
   static commentFilter: string[] = ['Comments', 'Answered'];
   static adminFilter: string[] = ['On moderation'];
   static adminEmail: string[] = ['admin@mail.ru', 'alesha@mail.ru'];
   static authorFilterArr: string[] = ['My questions'];
   static dateToken: Date = new Date(new Date().getTime() + 6000 * 1000);
}
