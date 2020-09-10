import {AlertType} from '../app/shared/services/alert.service';

export interface Environment {
  firebase: any;
  production: boolean;
  fbDbUrl: string;
}
export interface QuestionCard {
  id: string;
  title: string;
  date: string;
  directions: string;
}

export interface Post {
  id?: string;
  title: string;
  text: string;
  direct?: string[];
  date: number;
  author?: string;
  complete: boolean;
  adminApprove: boolean;
}
export interface FbCreateResponse {
  name: string;
}
export interface Alert {
  type: AlertType;
  text: string;
}
