import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {PandemicService} from "../../services/pandemic.service";
import {Carte} from "../../model/carte";

@Component({
  selector: 'app-modal-ville-info',
  templateUrl: './modal-ville-info.component.html',
  styleUrls: ['./modal-ville-info.component.scss']
})
export class ModalVilleInfoComponent implements OnInit{
  public ville:any = null;
  typeAction: any;
  errorMessage: any;
  option: string;
  villeDestination: any;
  numberCentreRecherche:any;
  infosJoueur:any = null;
  typePartage: any;
  joueurCible: any;
  carteAPrendre:any;
  cartePropARetirer:any;
  cartesADefausser:Array<number> = new Array<number>();
  public carteAReorganiser:Array<string> = new Array<string>();
  indexCarteAreorganiser:Array<number> = new Array<number>();
  maladie:any;
  phasePrevision: number = 1;
  cartePrevison:any;

  @Input() public idPartie:any;
  @Input() public nomVille:any;
  @Input() public listCentreRecherche:any;
  @Input() public listeJoueurs:any;

  constructor(public activeModal: NgbActiveModal,private pandemicService:PandemicService) {
    this.option = "Déplacement";
  }

  ngOnInit(): void {
    this.numberCentreRecherche = 6 - this.listCentreRecherche.length;
    this.getVilleInfos();
    this.getInfosJoueur();
  }

  onChangeAction(param: string) {
    this.villeDestination = "";
    this.typeAction = "";
    this.errorMessage = null;
    this.option = param;
  }

  getVilleInfos() {
    this.pandemicService.getVilleInfos(this.idPartie,this.nomVille).subscribe({
      next:(reponse) => {
        this.ville = reponse.body;
      },
      error:error => {
        this.errorMessage = error;
      }
    });
  }


  onJouerActionSurVille(){
    this.errorMessage = null;
    this.pandemicService.jouerActionSurVille(this.idPartie,
      this.ville.nom,this.typeAction).subscribe({
      next:(reponse) => {
        this.ville = reponse.body;
        this.villeDestination = "";
        this.typeAction = "";
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
        this.getInfosJoueur();
      }
    })
  }



  onJouerActionDeplacerStationRecrche(){
    this.errorMessage = null;
    this.pandemicService.jouerActionDeplacerStation(this.idPartie,
      this.villeDestination,this.ville.nom).subscribe({
      next:(reponse) => {
        this.ville = reponse.body;
        this.villeDestination = "";
        this.typeAction = "";
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
        this.getInfosJoueur();
      }
    })
  }

  onJouerActionContruireStationRecrche(){
    this.typeAction = "CONSTRUIRESTATIONRECHERCHE";
    this.villeDestination = this.infosJoueur.emplacement;
    this.onJouerActionSurVille();
  }

  private getInfosJoueur() {
    this.pandemicService.getMesInfos(this.idPartie).subscribe({
      next: (reponse) => {
        this.infosJoueur = reponse.body;
      },
      error: error => {
        this.errorMessage = error;
      }
    });
  }

  onJouerActionPartagerConnaissance(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerActionPartageConnaissance(this.idPartie,
      this.typePartage,this.joueurCible,tmpCarte).subscribe({
      next:() => {
        this.joueurCible = null;
        this.carteAPrendre = null;
        this.typePartage = "";
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
        this.getInfosJoueur();
      }
    })
  }

  onjouerActionDecouvrirRemedre(){
    this.errorMessage = null;
    if(this.cartesADefausser.length <= 0 ){
      this.errorMessage = "Veuillez choisir les cartes à defausser !";
      return;
    }
    console.log(this.cartesADefausser);
    this.pandemicService.jouerActionDecouvrirRemedre(this.idPartie,
      this.maladie,this.cartesADefausser).subscribe({
      next:(reponse) => {
        this.ville = reponse.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
        this.getInfosJoueur();
      }
    })
  }

  onjouerActionTraiterMaladie(){
    this.errorMessage = null;
    this.pandemicService.jouerActionTraiterMaladie(this.idPartie,
      this.maladie).subscribe({
      next:(reponse) => {
        this.ville = reponse.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
        this.getInfosJoueur();
      }
    })
  }

  onChangeCarteADefausser(i: number, checked: any) {
      if(checked.target.checked){
        this.cartesADefausser.push(i);
      }
      else {
        this.cartesADefausser.splice(this.cartesADefausser.indexOf(i),1);
      }
  }

  onChangeCarteAReorganiser(carte: Carte, checked: any) {
    if(checked.target.checked){
      this.carteAReorganiser.push(carte.nomVilleOuEvenement +" ("+carte.maladieOuDescr +")");
      let index = this.cartePrevison.findIndex((c:Carte) => c.nomVilleOuEvenement === carte.nomVilleOuEvenement);
      this.indexCarteAreorganiser.push(index);
    }
    else {
      this.carteAReorganiser.splice(this.carteAReorganiser.indexOf(carte.nomVilleOuEvenement +" ("+carte.maladieOuDescr +")"),1);
      let index = this.cartePrevison.findIndex((c:Carte) => c.nomVilleOuEvenement === carte.nomVilleOuEvenement);
      this.indexCarteAreorganiser.splice(this.indexCarteAreorganiser.indexOf(index),1);
    }
    console.log(this.indexCarteAreorganiser);
  }

  onJouerPrevisionPhase1(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerPrevision1(this.idPartie,
      tmpCarte).subscribe({
      next:(response) => {
        this.cartePrevison = response.body;
        this.phasePrevision = 2;
        this.carteAPrendre = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerPrevisionPhase2(){
    this.errorMessage = null;
    this.pandemicService.jouerPrevision2(this.idPartie,
      this.indexCarteAreorganiser).subscribe({
      next:(response) => {
        this.cartePrevison = response.body;
        this.phasePrevision = 1;
        this.carteAPrendre = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerPontAerien(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerPontAerien(this.idPartie,
      tmpCarte,this.joueurCible,this.ville.nom).subscribe({
      next:(response) => {
        this.ville = response.body;
        this.joueurCible = null;
        this.carteAPrendre = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerSubventionPublique(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerSubventionPublique(this.idPartie,
      tmpCarte,this.ville.nom).subscribe({
      next:(response) => {
        this.ville = response.body;
        this.carteAPrendre = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerSubventionPublique2(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerSubventionPublique2(this.idPartie,
      tmpCarte,this.ville.nom,this.villeDestination).subscribe({
      next:(response) => {
        this.ville = response.body;
        this.carteAPrendre = null;
        this.villeDestination = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerParUneNuitTranquille(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    this.pandemicService.jouerParUneNuitTranquille(this.idPartie,
      tmpCarte).subscribe({
      next:() => {
        this.carteAPrendre = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerPopResil(){
    this.errorMessage = null;
    let tmpCarte = Number(this.carteAPrendre) - 1;
    let tmpCarteProp = Number(this.cartePropARetirer) - 1;
    this.pandemicService.jouerPopResil(this.idPartie,
      tmpCarte,tmpCarteProp).subscribe({
      next:() => {
        this.carteAPrendre = null;
        this.cartePropARetirer = null;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }


  onJouerDeplacerPionJoueur(){
    this.errorMessage = null;
    this.pandemicService.jouerActionDeplacerPionJoueur(this.idPartie,
      this.joueurCible,this.ville.nom,this.typeAction).subscribe({
      next:(response) => {
        this.joueurCible = null;
        this.typeAction = null;
        this.carteAPrendre = null;
        this.ville = response.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerDeplacerPionVersJoueur(){
    this.errorMessage = null;
    if(this.listeJoueurs.length <= 0){
      this.errorMessage = "Aucun joueur dans cette ville !";
      return;
    }
    this.pandemicService.jouerActionDeplacerPionVersJoueur(this.idPartie,
      this.joueurCible,this.listeJoueurs[0]).subscribe({
      next:(response) => {
        this.joueurCible = null;
        this.ville = response.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerActionStationVersVilleExpertOpe(){
    this.errorMessage = null;
    this.pandemicService.jouerActionStationVersVilleExpertOpe(this.idPartie,
      this.ville.nom,this.carteAPrendre).subscribe({
      next:(response) => {
        this.carteAPrendre = null;
        this.ville = response.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerActionDeplacerStationParExpertOpe(){
    this.errorMessage = null;
    this.pandemicService.jouerActionDeplacerStationParExpertOpe(this.idPartie,
      this.villeDestination).subscribe({
      next:(response) => {
        this.villeDestination = null;
        this.ville = response.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

  onJouerActionConstruireStationParExpertOpe(){
    this.errorMessage = null;
    this.pandemicService.jouerActionConstruireStationParExpertOpe(this.idPartie).subscribe({
      next:(response) => {
        this.villeDestination = null;
        this.ville = response.body;
        this.getInfosJoueur();
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })
  }

}
