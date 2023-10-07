import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {Identifiants} from "../../../model/identifiants";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})

export class ConnexionComponent implements OnInit {
  public errorMessage: string = "";
  public submitted = false;

  public form = new FormGroup({
    pseudo: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private authService:AuthService) {

  }

  ngOnInit(): void {
    if(this.authService.estConnecte()){
      this.router.navigateByUrl("/accueil");
    }
  }

  handleSubmit() {
    this.submitted = true;
    if (this.form.invalid) { return; }

    this.authService.connexion(<Identifiants>this.form.value).subscribe(
      resultat => {
        this.errorMessage = '';
        this.router.navigateByUrl('/accueil');
      },

      error => {
        if (error.status === 406) {
          this.errorMessage = error.error;
          return;
        }
        if (error.status === 409) {
          this.errorMessage = error.error;
          return;
        }
        this.errorMessage = 'Erreur serveur, veuillez ré-essayer plus tard.';
      }
    );
  }

}
