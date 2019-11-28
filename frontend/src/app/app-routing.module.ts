import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthComponent } from "./Authentification/auth/auth.component";
import { ShopsListComponent } from "./shops/shops-list/shops-list.component";
import { AuthGuard } from "./Authentification/auth.guard";

const routes: Routes = [
  { path: "signin", component: AuthComponent },
  { path: "signup", component: AuthComponent },
  {
    path: "shops",
    component: ShopsListComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: "prefered", component: ShopsListComponent },
      { path: "nearby", component: ShopsListComponent }
    ]
  },
  { path: "**", redirectTo: "shops" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
