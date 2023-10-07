import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {PandemicService} from "./pandemic.service";

@Injectable({
  providedIn: 'root'
})
export class AttenteJoueursGuardService {

  constructor(private authService: AuthService,
              private router: Router,
              private pandemicService:PandemicService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>{

    return new Observable<boolean>(obs => {
      const id =  route.params['id']
      let idPartie:any;
      if(id !== null) {
        idPartie = parseInt(id);
      }
      this.pandemicService.getJoueursConnectes(idPartie).subscribe({
          next: data => {
          const pseudo = this.authService.getDonneesUtilisateur();
          if(data.body.joueursConnectes.includes(pseudo)){
            obs.next(true);
          }
          else {
            this.router.navigateByUrl('/accueil');
            obs.next(false);
          }
        },
        error: error => {
          console.log(error);
        }
      });
    });
  }
}
