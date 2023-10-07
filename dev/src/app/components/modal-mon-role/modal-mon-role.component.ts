import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Carte} from "../../model/carte";
import {InfoJoueur} from "../../model/infoJoueur";
import {ModalVilleInfoComponent} from "../modal-ville-info/modal-ville-info.component";
import {PandemicService} from "../../services/pandemic.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-modal-mon-role',
  templateUrl: './modal-mon-role.component.html',
  styleUrls: ['./modal-mon-role.component.scss']
})
export class ModalMonRoleComponent implements OnInit{
  typeAction: any;
  errorMessage: any;
  option: string;
  villeDestination: any;
  typePartage: any;
  joueurCible: any;
  infosVilleCourant:any;
  villeLoaded:boolean = false;
  villes:any
  @Input() public infosJoueur:any;
  @Input() public idPartie:any;

  constructor(public activeModal: NgbActiveModal,private pandemicService:PandemicService) {
    this.option = "Maladie";
  }


  ngOnInit(): void {
    this.getVilleInfos();
  }

  getVilleInfos() {
    this.pandemicService.getVilleInfos(this.idPartie,this.infosJoueur.emplacement).subscribe({
      next:(reponse) => {
        this.infosVilleCourant = reponse.body;
      },
      error:error => {
        console.log(error);
      }
    });
  }

  onChangeAction(param: string) {
    this.villeDestination = "";
    this.typeAction = "";
    this.errorMessage = null;
    this.option = param;
  }

  //TODO
  private onResetInfosJoueur() {
    this.pandemicService.getMesInfos(this.idPartie).subscribe({
      next: (reponse) => {
        this.infosJoueur = reponse.body;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onLoadVilles(){
    this.pandemicService.getVilles(this.idPartie).subscribe({
      next:(reponse) => {
        this.villeLoaded = true;
        this.villes = reponse.body;
      },
      error:error => {
        this.errorMessage = error.error;
      }
    });
  }

}
