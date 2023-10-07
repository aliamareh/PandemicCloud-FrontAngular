import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Carte} from "../../model/carte";
import {PandemicService} from "../../services/pandemic.service";

@Component({
  selector: 'app-modal-mes-cartes',
  templateUrl: './modal-mes-cartes.component.html',
  styleUrls: ['./modal-mes-cartes.component.scss']
})
export class ModalMesCartesComponent implements OnInit{
  @Input() public cartes:any;
  @Input() public titre:any;
  @Input() public idPartie:any;
  errorMessage:any;
  constructor(public activeModal: NgbActiveModal, public pandemicService:PandemicService) {

  }

  ngOnInit(): void {
  }


  onDefausserCarte($event: MouseEvent) {
    this.errorMessage = null;
    let carteChoisit : string = ($event.target as Element).id
    let indexCarte = -1;
    let carte :any;
    let i = 0;
    this.cartes.forEach( (c:Carte) => {
      if (c.nomVilleOuEvenement === carteChoisit){
        indexCarte = i;
        carte = c;
      }
      i++;
    });

    this.pandemicService.defausserCarteJoueur(this.idPartie,
      indexCarte).subscribe({
      next:(reponse) => {
          this.cartes.splice(indexCarte,1);
      },
      error:error => {
        this.errorMessage = error.error;
      }
    })

  }
}
