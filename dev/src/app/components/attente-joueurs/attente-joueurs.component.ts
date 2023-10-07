import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {PandemicService} from "../../services/pandemic.service";
import {interval, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-attente-joueurs',
  templateUrl: './attente-joueurs.component.html',
  styleUrls: ['./attente-joueurs.component.scss']
})
export class AttenteJoueursComponent implements OnInit{
  public idPartie: any;
  public nbJoueursAttendus:any;
  public joueursConnectes:Set<string>;
  public sub: any = null;
  public error:any;

  constructor(private route:ActivatedRoute,private router:Router,private pandemicService:PandemicService) {
    this.joueursConnectes = new Set();
  }

  ngOnInit(): void {
    this.getJoueurs();
  }

  public getJoueurs(){
    const id = this.route.snapshot.paramMap.get('id')
    if(id !== null){
      this.idPartie = parseInt(id);

      if (this.sub !== null) {
        this.sub.unsubscribe();
      }

      this.sub = interval(1000).pipe(
        switchMap(() => this.pandemicService.getJoueursConnectes(this.idPartie))
      ).subscribe({
        next: data => {
          this.joueursConnectes.clear();
          data.body.joueursConnectes.forEach((j:any) => this.joueursConnectes.add(j));
          this.nbJoueursAttendus = data.body.nbJoueursTotal;
        },
        error: error => {
          this.error = error.error;
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
        this.error = error.error;
        console.log(error)
      }
    });
  }

  onDemarrerPartie() {
    this.pandemicService.demarerrerPartie(this.idPartie).subscribe({
      next:(reponse) => {
        this.router.navigate(['/partie/'+this.idPartie])
      },
      error:error => {
        if (error.status === 409) {
          //un joueur a déjà demarrer la partie
          this.router.navigate(['/partie/'+this.idPartie]);
        }
        this.error = error.error;
        console.log(error)
      }
    });
  }

}
