export interface Environment {
  firebase: any;
  production: boolean;
  fbDbUrl: string;
}
export interface QuestionCard {
  id: any;
  title: string;
  date: string;
  directions: string;
}

export interface Post {
  id?: any;
  title: string;
  text: string;
  direct?: any[];
  date: Date;
}
export interface FbCreateResponse {
  name: string;
}
