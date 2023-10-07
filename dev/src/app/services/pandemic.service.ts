import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {map, Observable, Observer} from "rxjs";
import {VilleInfos} from "../model/villeInfos";
import {InfoJoueur} from "../model/infoJoueur";
import {Carte} from "../model/carte";
import {EtatPartie} from "../model/etatPartie";
import {PartieTerminee} from "../model/partieTerminee";

const BASE_URL = environment.BASE_API+"partie/";
@Injectable({
  providedIn: 'root'
})
export class PandemicService {

  constructor(private http: HttpClient,private storage: Storage,private zone:NgZone) { }

  getPartiesTerminees():Observable<HttpResponse<Array<PartieTerminee>>>{
    return this.http.get<Array<PartieTerminee>>(environment.BASE_API+`parties/terminees`,
      {observe:'response'});
  }

  getPartiesNonTerminees():Observable<HttpResponse<Array<PartieTerminee>>>{
    return this.http.get<Array<PartieTerminee>>
    (environment.BASE_API+`parties/non-terminees`,{observe:'response'});
  }

  creerPartie(nbJoueur:number){
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("nbJoueurs",`${nbJoueur}`);
    return this.http.post<any>(`${BASE_URL}${environment.CREER_PARTIE}`
      ,body, {headers:head,observe: 'response'});
  }

  rejoindrePartie(idPartie:number){
    const head = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post<any>(`${BASE_URL}${idPartie}/join`, {headers:head,observe:"response"});
  }

  getJoueursConnectes(idPartie: number) {
    return this.http.get<any>(`${BASE_URL}${idPartie}/joueurs-connectes`,{observe:'response'});
  }

  quittezPartie(idPartie:number){
    const head = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post<any>(`${BASE_URL}${idPartie}/quitter`
      ,{headers:head,observe:"response"});
  }

  demarerrerPartie(idPartie:number){
    return this.http.post<any>(`${BASE_URL}${idPartie}/start`,
      {},{observe:"response"})
  }

  getEtatPartie(idPartie: number):Observable<HttpResponse<EtatPartie>> {
    return this.http.get<EtatPartie>(`${BASE_URL}${idPartie}`,{observe:'response'});
  }

  getPartieEnCour(idPartie: number) {
    return this.http.get<any>(`${BASE_URL}${idPartie}/encours`,{observe:'response'});
  }

  getMesCartes(idPartie: number):Observable<HttpResponse<Carte[]>> {
    const pseudo = this.storage.getItem('pseudo');
    return this.http.get<Carte[]>(`${BASE_URL}${idPartie}/${pseudo}/mescartes`,{observe:'response'});
  }

  getMesInfos(idPartie: number):Observable<HttpResponse<InfoJoueur>>{
    const pseudo = this.storage.getItem('pseudo');
    return this.http.get<InfoJoueur>(`${BASE_URL}${idPartie}/${pseudo}/mesinfos`,{observe:'response'});

  }

  getVilleInfos(idPartie: number,ville:string) :Observable<HttpResponse<VilleInfos>>{
    return this.http.get<VilleInfos>(`${BASE_URL}${idPartie}/${ville}/infos`,{observe:'response'});
  }

  getVilles(idPartie: number) :Observable<HttpResponse<Array<string>>>{
    return this.http.get<Array<string>>(`${BASE_URL}${idPartie}/villes`,{observe:'response'});
  }

  jouerActionSurVille(idPartie: number,ville:string,action:string) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("ville",`${ville}`);
    body.set("action",`${action}`);
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionVille`,
      body,{headers:head,observe:'response'});
  }

  jouerActionDeplacerStation(idPartie: number,source:string,destination:string) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("source",`${source}`);
    body.set("destination",`${destination}`);
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/deplacer-station`,
      body,{headers:head,observe:'response'});
  }

  jouerActionPartageConnaissance(idPartie: number,typePartage:string,joueurCible:string, carte:number) {
    const emetteur = (typePartage === 'prendre') ? joueurCible : this.storage.getItem("pseudo");
    const recepeteur = (typePartage === 'prendre') ? this.storage.getItem("pseudo") : joueurCible;
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("emetteur",`${emetteur}`);
    body.set("recepteur",`${recepeteur}`);
    body.set("carte",`${carte}`);
    return this.http.post(`${BASE_URL}${idPartie}/jouerPartagerConnaissance`,
      body,{headers:head,observe:'response'});
  }

  jouerActionTraiterMaladie(idPartie: number,maladie:string) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();

    body.set("maladie",`${maladie}`);
    body.set("typeAction","TRAITERMALADIE")
    body.set("cartes","");
    return this.http.post(`${BASE_URL}${idPartie}/jouerContreMaladie`,
      body,{headers:head,observe:'response'});
  }

  jouerActionDecouvrirRemedre(idPartie: number,maladie:string,cartes:Array<number>) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();

    body.set("maladie",`${maladie}`);
    body.set("typeAction","DECOUVRIRREMEDE")
    cartes.forEach(c => body.append("cartes",`${c-1}`));
    return this.http.post(`${BASE_URL}${idPartie}/jouerContreMaladie`,
      body,{headers:head,observe:'response'});
  }

  defausserCarteJoueur(idPartie: number,carte:number) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`)

    return this.http.post(`${BASE_URL}${idPartie}/defausserJoueur`,
      body,{headers:head,observe:'response'});
  }

  jouerPontAerien(idPartie: number,carte:number,cible:string,destination:string) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    body.set("cible",`${cible}`);
    body.set("destination",`${destination}`);

    return this.http.post(`${BASE_URL}${idPartie}/jouerEvenement/pontAerien`,
      body,{headers:head,observe:'response'});
  }

  jouerSubventionPublique(idPartie: number,carte:number,ville:string) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    body.set("ville",`${ville}`);

    return this.http.post(`${BASE_URL}${idPartie}/jouerEvenement/subventionpublique`,
      body,{headers:head,observe:'response'});
  }

  jouerSubventionPublique2(idPartie: number,carte:number,ville:string,villeaenlever:string) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    body.set("ville",`${ville}`);
    body.set("villeaenlever",`${villeaenlever}`);
    return this.http.post(`${BASE_URL}${idPartie}/jouerEvenement/subventionpublique2`,
      body,{headers:head,observe:'response'});
  }

  jouerParUneNuitTranquille(idPartie: number,carte:number) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    return this.http.post(`${BASE_URL}${idPartie}/jouerEvenement/parUneNuitTranquille`,
      body,{headers:head,observe:'response'});
  }

  jouerPopResil(idPartie: number,carte:number,prop:number) {
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    body.set("prop",`${prop}`);
    return this.http.post(`${BASE_URL}${idPartie}/jouerEvenement/popResil`,
      body,{headers:head,observe:'response'});
  }

  jouerPrevision1(idPartie: number,carte:number) :Observable<HttpResponse<Carte>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    return this.http.post<Carte>(`${BASE_URL}${idPartie}/jouerEvenement/prevision1`,
      body,{headers:head,observe:'response'});
  }

  jouerPrevision2(idPartie: number,cartes:Array<number>) :Observable<HttpResponse<Carte>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    cartes.forEach(c => body.append("indexCartes",`${c}`));
    return this.http.post<Carte>(`${BASE_URL}${idPartie}/jouerEvenement/prevision2`,
      body,{headers:head,observe:'response'});
  }

  jouerActionDeplacerPionJoueur(idPartie: number,joueurControle:string,ville:string,action:string) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("pseudojcontrole",`${joueurControle}`);
    body.set("typeAction",`${action}`);
    body.set("villeDest",`${ville}`)
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionDeplacerPionRepartiteur`,
      body,{headers:head,observe:'response'});
  }

  jouerActionDeplacerPionVersJoueur(idPartie: number,joueurControle:string,joueurARejoindre:string) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("jadeplacer",`${joueurControle}`);
    body.set("jarejoindre",`${joueurARejoindre}`)
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionDeplacerVersJoueurParRepartiteur`,
      body,{headers:head,observe:'response'});
  }

  jouerActionStationVersVilleExpertOpe(idPartie: number,ville:string,carte:number) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("carte",`${carte}`);
    body.set("ville",`${ville}`)
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionStationVersVilleExpertOpe`,
      body,{headers:head,observe:'response'});
  }

  jouerActionDeplacerStationParExpertOpe(idPartie: number,ville:string) :Observable<HttpResponse<VilleInfos>>{
    const head = new HttpHeaders(
      {"Content-Type":"application/x-www-form-urlencoded"}
    );
    const body = new URLSearchParams();
    body.set("ville",`${ville}`)
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionDeplacerStationParExpertOpe`,
      body,{headers:head,observe:'response'});
  }

  jouerActionConstruireStationParExpertOpe(idPartie: number){
    return this.http.post<VilleInfos>(`${BASE_URL}${idPartie}/jouerActionConstruireStationParExpertOpe`,
      {},{observe:'response'});
  }

}
