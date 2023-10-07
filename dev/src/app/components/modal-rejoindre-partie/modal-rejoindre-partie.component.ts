import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {PandemicService} from "../../services/pandemic.service";

@Component({
  selector: 'app-modal-rejoindre-partie',
  templateUrl: './modal-rejoindre-partie.component.html',
  styleUrls: ['./modal-rejoindre-partie.component.scss']
})
export class ModalRejoindrePartieComponent implements OnInit{

  public enregistrement: Boolean= false;
  public nbJoueurs: any;
  public errorMessage: string = "";

  constructor(public activeModal: NgbActiveModal,private router:Router,private pandemicService:PandemicService) {
  }

  ngOnInit(): void {
  }

  onConnexionPartie(idPartie:any) {
    this.enregistrement = true;
    if(idPartie === null){
      this.enregistrement = false;
      this.errorMessage = "Veuillez renseigner l'identifiant de la partie !";
    }

    this.pandemicService.rejoindrePartie(idPartie).subscribe({
      next:(reponse) => {
        this.activeModal.close();
        this.router.navigate(['/attente-joueurs/'+idPartie])
      },
      error:(error) => {
        if (error.status === 409) {
          this.activeModal.close();
          this.router.navigate(['/attente-joueurs/'+idPartie])
        }
        if (error.status === 406) {
          this.enregistrement = false;
          this.errorMessage = error.error;
          return;
        }
        this.errorMessage = 'Erreur serveur, veuillez ré-essayer plus tard.';
      }
    });
  }

}
