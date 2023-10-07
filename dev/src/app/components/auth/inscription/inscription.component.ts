import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Identifiants} from "../../../model/identifiants";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
  public error = false;
  public submitted = false;

  form = new FormGroup({
    pseudo: new FormControl('',[Validators.required,Validators.minLength(3)]),
    password: new FormControl('',[Validators.required,Validators.minLength(4)]),
    plainPassword: new FormControl('',[Validators.minLength(4)]),
  });

  constructor(private router: Router,private authService:AuthService) { }

  ngOnInit(): void {

  }

  get pseudo() {
    return this.form.get('pseudo');
  }

  get password() {
    return this.form.get('password');
  }

  get plainPassword(){
    return this.form.get('plainPassword');
  }

  handleSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    if(this.form.controls["password"].value !== this.form.controls["plainPassword"].value ){
      this.form.get("password")?.setErrors({violation: "Mots de passe non identiques !"})
      return;
    }
    const form = this.form.value;
    delete form.plainPassword;
    this.authService.inscription(<Identifiants> form).subscribe({
      next:() => {
        this.router.navigateByUrl('/accueil');
      },
      error: error => {
        if (error.status === 409) {
          const formProp = this.form.get("pseudo");
          if (formProp) {
            formProp.setErrors({
              violation: error.error
            });
          }
          return;
        }
        console.log(error)
        this.error = true;
      }
    });
  }
}
