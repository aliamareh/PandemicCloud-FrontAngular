import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {PandemicService} from "./pandemic.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PartieGuardService {

  constructor(private authService: AuthService,
              private router: Router,
              private pandemicService:PandemicService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>{

    return new Observable<boolean>(obs => {
      const id = route.params['id']
      let idPartie: any;
      if (id !== null) {
        idPartie = parseInt(id);
      }

      this.pandemicService.getPartieEnCour(idPartie).subscribe({
        next: (data) => {
          if (data.status === 200) {
            obs.next(true);
          } else {
            obs.next(false);
            this.router.navigateByUrl('/accueil');
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    });
  }
}
