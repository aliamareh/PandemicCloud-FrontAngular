import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {PandemicService} from "../../services/pandemic.service";

@Component({
  selector: 'app-modal-creer-partie',
  templateUrl: './modal-creer-partie.component.html',
  styleUrls: ['./modal-creer-partie.component.scss']
})
export class ModalCreerPartieComponent implements OnInit{

  public enregistrement: Boolean= false;
  public nbJoueurs: any;
  public errorMessage: string = "";
  public created:boolean = false;
  public idPartie:any;

  constructor(public activeModal: NgbActiveModal,private router:Router,private pandemicService:PandemicService) {

  }

  ngOnInit(): void {
  }

  onCreatePartie() {
    this.enregistrement = true;

    if(this.nbJoueurs == null){
      this.enregistrement = false;
      this.errorMessage = "Veuillez choisir un nombre de joueurs valide !"
    }

    this.pandemicService.creerPartie(this.nbJoueurs).subscribe({
     next: (reponse) => {
        this.idPartie = reponse.body.idPartie;
        this.created = true;
        this.enregistrement = false;
      },
      error: (error) => {
        this.enregistrement = false;
        if (error.status === 406) {
          this.errorMessage = error.error;
          return;
        }
        this.errorMessage = 'Erreur serveur, veuillez ré-essayer plus tard.';
      }
    });
  }

  onRejoindrePartie() {
    this.enregistrement = true;

    this.pandemicService.rejoindrePartie(this.idPartie).subscribe({
      next:() => {
        this.activeModal.close();
        this.router.navigate(['/attente-joueurs/'+this.idPartie])
      },
     error: (error) => {
        this.enregistrement = false;
        if (error.status === 406) {
          this.errorMessage = error.error;
          return;
        }
        this.errorMessage = 'Erreur serveur, veuillez ré-essayer plus tard.';
      }
    });
  }

}
