import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthComponent } from "./Authentification/auth/auth.component";
import { ShopsListComponent } from "./shops/shops-list/shops-list.component";
import { AuthGuard } from "./Authentification/auth.guard";

const routes: Routes = [
  { path: "signin", component: AuthComponent },
  { path: "signup", component: AuthComponent },
  {
    path: "shops/:target",
    component: ShopsListComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "shops/all" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
