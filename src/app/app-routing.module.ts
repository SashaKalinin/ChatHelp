import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';

import {PostPageComponent} from './post-page/post-page.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {SignUpPageComponent} from './auth/sign-up-page/sign-up-page.component';
import {AuthGuard} from './shared/services/auth.guard';
import {AskQuestionComponent} from './ask-question/ask-question.component';

const routers: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'post', pathMatch: 'full'},
      {path: 'post', component: PostPageComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginPageComponent},
      {path: 'sign-up', component: SignUpPageComponent},
      {path: 'ask', component: AskQuestionComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routers)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
