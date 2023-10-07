import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {ConnexionComponent} from "./components/auth/connexion/connexion.component";
import { InscriptionComponent } from './components/auth/inscription/inscription.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { AttenteJoueursComponent } from './components/attente-joueurs/attente-joueurs.component';
import { PartieComponent } from './components/partie/partie.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ModalVilleInfoComponent } from './components/modal-ville-info/modal-ville-info.component';
import { ModalMesCartesComponent } from './components/modal-mes-cartes/modal-mes-cartes.component';
import { ModalCreerPartieComponent } from './components/modal-creer-partie/modal-creer-partie.component';
import { ModalRejoindrePartieComponent } from './components/modal-rejoindre-partie/modal-rejoindre-partie.component';
import { ModalMonRoleComponent } from './components/modal-mon-role/modal-mon-role.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterOutlet} from "@angular/router";
import {JwtInterceptor} from "./services/jwt.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    InscriptionComponent,
    AccueilComponent,
    AttenteJoueursComponent,
    PartieComponent,
    ModalVilleInfoComponent,
    ModalMesCartesComponent,
    ModalCreerPartieComponent,
    ModalRejoindrePartieComponent,
    ModalMonRoleComponent
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      HttpClientModule,
      RouterOutlet
    ],
  providers: [
    {
      provide: Storage,
      useValue: window.localStorage,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ ModalVilleInfoComponent,
    ModalMesCartesComponent,
    ModalCreerPartieComponent,
    ModalRejoindrePartieComponent,
    ModalMonRoleComponent,ModalMonRoleComponent]
})
export class AppModule { }
