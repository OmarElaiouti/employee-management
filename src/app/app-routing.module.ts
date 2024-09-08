import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RedirectFromLoginGuard } from './guards/redirect-from-login/redirect-from-login.guard';

const routes: Routes = [
  { path: '', component: LoginComponent  , canActivate: [RedirectFromLoginGuard]},
  { path: 'management', component: IndexComponent , canActivate: [AuthGuard]},
  { path: 'unauthorized', component: UnauthorizedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
