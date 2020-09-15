import {AlertType} from '../app/shared/services/alert.service';

export interface Environment {
  firebase: any;
  production: boolean;
  fbDbUrl: string;
}

export interface Post {
  id?: string;
  title: string;
  text: string;
  direct?: string[];
  date: number;
  author?: string;
  complete: boolean;
  admin?: boolean;
  adminApprove: boolean;
  answers?: Answers[];
}
export interface FbCreateResponse {
  name: string;
}
export interface Alert {
  type: AlertType;
  text: string;
}

export interface Answers {
  id: string;
  author: string;
  text: string;
  date: number;
  correct: boolean;
}
