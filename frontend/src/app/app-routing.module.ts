import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthComponent } from "./Authentification/auth/auth.component";
import { ShopsListComponent } from "./shops/shops-list/shops-list.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { BeforeLoginGuard } from "./Authentification/before-login.guard";
import { AfterLoginGuard } from "./Authentification/after-login.guard";

const routes: Routes = [
  { path: "signin", component: AuthComponent, canActivate: [BeforeLoginGuard] },
  { path: "signup", component: AuthComponent, canActivate: [BeforeLoginGuard] },
  {
    path: "shops/:target",
    component: ShopsListComponent,
    canActivate: [AfterLoginGuard]
  },
  { path: '', redirectTo: "shops/all", pathMatch: 'full' },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
