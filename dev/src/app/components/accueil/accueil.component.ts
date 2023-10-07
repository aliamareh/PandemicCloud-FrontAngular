import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Route, Router} from "@angular/router";
import {ModalCreerPartieComponent} from "../modal-creer-partie/modal-creer-partie.component";
import {ModalRejoindrePartieComponent} from "../modal-rejoindre-partie/modal-rejoindre-partie.component";
import {AuthService} from "../../services/auth.service";
import {Identifiants} from "../../model/identifiants";
import {PandemicService} from "../../services/pandemic.service";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  public option: string = "";
  public listeParties:any;
  pseudo: any;
  public avatars = ["👮","👷🏼‍","👩🏻‍","🦸🏻‍"];

  constructor(private modalService: NgbModal,private router:Router,
              private authService:AuthService,private pandemicService:PandemicService) {

  }
  ngOnInit(): void{
      this.option = "non-finis";
      this.pseudo = this.authService.getDonneesUtilisateur();
      this.getPartiesNonTerminees();
  }

  getPartiesTerminees() {
    this.pandemicService.getPartiesTerminees().subscribe({
      next: (response) => {
        this.listeParties = response.body;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getPartiesNonTerminees() {
    this.pandemicService.getPartiesNonTerminees().subscribe({
      next: (response) => {
        this.listeParties = response.body;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onFilterByOption(option: string) {
    this.listeParties = [];
    this.option = option;
    if(this.option === "fini"){
      this.getPartiesTerminees();
    }
    if(this.option === "non-finis"){
      this.getPartiesNonTerminees();
    }
  }


  openRejoindrePartie() {
    const modalRef = this.modalService.open(ModalRejoindrePartieComponent);
  }

  openCreerPartie() {
    const modalRef = this.modalService.open(ModalCreerPartieComponent);
  }

  onDeconnexion() {
    this.authService.deconnexion().subscribe(
      resultat => {
        this.router.navigateByUrl('/');
      },

      error => {
          this.router.navigateByUrl('/');
      }
    );
  }
}
