import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalVilleInfoComponent} from "../modal-ville-info/modal-ville-info.component";
import {ModalMesCartesComponent} from "../modal-mes-cartes/modal-mes-cartes.component";
import {ModalMonRoleComponent} from "../modal-mon-role/modal-mon-role.component";
import {interval, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {PandemicService} from "../../services/pandemic.service";
import {EtatPartie} from "../../model/etatPartie";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-partie',
  templateUrl: './partie.component.html',
  styleUrls: ['./partie.component.scss']
})
export class PartieComponent implements OnInit{
  public idPartie: any;
  public sub: any = null;
  public etatPartie:any;
  public etatPartieLoaded: boolean = false ;
  public pseudo:any;
  public dernierCarteProp:any;
  public dernierCarteJoueur:any;
  public emplacementJc:any;

  constructor(private modalService: NgbModal, private route:ActivatedRoute,
              private router:Router,private pandemicService:PandemicService,private authService:AuthService)
  {

  }

  ngOnInit(): void {
    this.pseudo = this.authService.getDonneesUtilisateur();
    this.getEtatPartie();
  }

  public getEtatPartie(){
    const id = this.route.snapshot.paramMap.get('id')
    if(id !== null){
      this.idPartie = parseInt(id);

      if (this.sub !== null) {
        this.sub.unsubscribe();
      }
      if(this.etatPartie===undefined || this.etatPartie.etat === 1){
        this.sub = interval(10000).pipe(
          switchMap(() => this.pandemicService.getEtatPartie(this.idPartie))
        ).subscribe({
          next: data => {
            this.etatPartie = data.body;
            this.dernierCarteJoueur = this.etatPartie.defausseJoueur.at(0);
            this.dernierCarteProp = this.etatPartie.defaussePropagation.at(0);
            this.etatPartieLoaded = true;
            this.emplacementJc = this.etatPartie.joueurs[this.pseudo];
            console.log(data.body);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }
  }


  openMesAction() {
    if(this.etatPartie.etat === 1){
      this.pandemicService.getMesInfos(this.idPartie).subscribe({
        next:(reponse) => {
          const modalRef = this.modalService.open(ModalMonRoleComponent,{size:'lg'});
          modalRef.componentInstance.infosJoueur = reponse.body;
          modalRef.componentInstance.idPartie = this.idPartie;
          modalRef.componentInstance.listCentreRecherche = this.etatPartie.centreRecherche;
        },
        error:error => {
          console.log(error);
        }
      });
    }
  }

  openDefausseJoueur() {
    if(this.etatPartie.etat === 1) {
      const modalRef = this.modalService.open(ModalMesCartesComponent);
      modalRef.componentInstance.cartes = this.etatPartie.defausseJoueur;
      modalRef.componentInstance.titre = "Cartes défausse joueur";
    }
  }

  openDefausseProp() {
    if(this.etatPartie.etat === 1){
      const modalRef = this.modalService.open(ModalMesCartesComponent);
      modalRef.componentInstance.cartes = this.etatPartie.defaussePropagation;
      modalRef.componentInstance.titre = "Cartes défausse propagation"
    }
  }

  openVilleInfos(ville:string) {
    if(this.etatPartie.etat === 1){
      const modalRef = this.modalService.open(ModalVilleInfoComponent,{size:'lg'});
      modalRef.componentInstance.nomVille = ville;
      modalRef.componentInstance.idPartie = this.idPartie;
      modalRef.componentInstance.listCentreRecherche = this.etatPartie.centreRecherche;
      modalRef.componentInstance.listeJoueurs = Object.keys(this.etatPartie.joueurs);
    }
  }

  openMesCartes() {
    if(this.etatPartie.etat === 1) {
      this.pandemicService.getMesCartes(this.idPartie).subscribe({
        next: (reponse) => {
          const modalRef = this.modalService.open(ModalMesCartesComponent);
          modalRef.componentInstance.cartes = reponse.body;
          modalRef.componentInstance.idPartie = this.idPartie;
          modalRef.componentInstance.titre = "Mes cartes"
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  onQuittezPartie() {
    this.pandemicService.quittezPartie(this.idPartie).subscribe({
      next: () => {
        this.router.navigate(['/accueil'])
      },
      error: error => {
        console.log(error)
      }
    });
  }
}

