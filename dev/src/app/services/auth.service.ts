import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {map, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Identifiants} from "../model/identifiants";

const BASE_URL = environment.BASE_API;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private etatAuth = new Subject<boolean>();

  constructor(private zone:NgZone, private http: HttpClient, private storage: Storage) { }

  connexion(identifiants: Identifiants) {
    return this.http.post<any>(`${BASE_URL}${environment.CONNEXION}`,identifiants, {observe: 'response'})
      .pipe(
        map(( resultat) => {
          this.storage.setItem('pseudo', identifiants.pseudo);
          const authorizationValues = resultat.headers.getAll("Authorization")
          if(authorizationValues){
            const token = authorizationValues[0].split(" ")[1];
            this.storage.setItem("token",token);
          }
          this.etatAuth.next(true);
          return resultat;
        })
      );
  }

  deconnexion() {
    const head = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post(`${BASE_URL}${environment.DECCONEXION}`,
      {headers:head},{observe:"response"})
      .pipe(map(response=> {
          this.storage.removeItem('pseudo');
          this.storage.removeItem('token');
          this.etatAuth.next(false);
          return response
        }
      ));
  }

  inscription(identifiants:Identifiants) {
    return this.http.post<any>(`${BASE_URL}${environment.INSCRIPTION}`,identifiants, {observe:"response"})
      .pipe(
        map(( resultat) => {
          const authorizationValues = resultat.headers.getAll("Authorization");
          this.storage.setItem('pseudo', identifiants.pseudo);
          if(authorizationValues){
            const token = authorizationValues[0].split(" ")[1];
            this.storage.setItem("token",token);
          }
          this.etatAuth.next(true);
          return resultat;
        })
    );
  }

  estConnecte() {
    const pseudo = this.storage.getItem('pseudo');
    return pseudo !== null ;
  }

  getDonneesUtilisateur() {
    if(this.estConnecte()){
      return this.storage.getItem("pseudo");
    }
    return null;
  }

  getTokenUtilisateur() {
    if(this.estConnecte()){
      return this.storage.getItem("token");
    }
    return null;
  }
}
