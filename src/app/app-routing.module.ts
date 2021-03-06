import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';

import {PostPageComponent} from './post-page/post-page.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {SignUpPageComponent} from './auth/sign-up-page/sign-up-page.component';
import {AuthGuard} from './shared/services/auth.guard';
import {AskQuestionComponent} from './post-page/ask-question/ask-question.component';
import {PostCardComponent} from './post-page/post-card/post-card.component';
import {EditPageComponent} from './post-page/edit-page/edit-page.component';
import {LogInGuard} from "./shared/services/log-in.guard";

const routers: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'posts', pathMatch: 'full'},
      {path: 'posts', component: PostPageComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginPageComponent, canActivate: [LogInGuard]},
      {path: 'sign-up', component: SignUpPageComponent, canActivate: [LogInGuard]},
      {path: 'ask', component: AskQuestionComponent, canActivate: [AuthGuard]},
      {path: 'post/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]},
      {path: 'post/:id', component: PostCardComponent, canActivate: [AuthGuard]}, // activatedRout переделать
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routers)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
