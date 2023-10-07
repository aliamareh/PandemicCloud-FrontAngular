import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {ConnexionComponent} from "./components/auth/connexion/connexion.component";
import {InscriptionComponent} from "./components/auth/inscription/inscription.component";
import {AccueilComponent} from "./components/accueil/accueil.component";
import {AttenteJoueursComponent} from "./components/attente-joueurs/attente-joueurs.component";
import {PartieComponent} from "./components/partie/partie.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {AttenteJoueursGuardService} from "./services/attente-joueurs-guard.service";
import {PartieGuardService} from "./services/partie-guard.service";

const routes: Routes = [
  {path:"",component:ConnexionComponent},
  {path:"accueil",component:AccueilComponent,canActivate:[AuthGuardService]},
  {path:"attente-joueurs/:id",component:AttenteJoueursComponent,canActivate:[AttenteJoueursGuardService]},
  {path:"partie",component:PartieComponent},
  {path:"inscription",component:InscriptionComponent},
  {path:"partie/:id",component:PartieComponent,
    canActivate:[AttenteJoueursGuardService,PartieGuardService]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
