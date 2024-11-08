import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginData } from 'src/app/interfaces/isesion';
import { AuthService } from 'src/app/services/auth.service';
import { BdlocalService } from 'src/app/services/bdlocal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login: LoginData = {
    usernameOrEmail: "",
    password: ""
  };

  field: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private bdLocalService: BdlocalService
  ) {}

  ngOnInit() {}

  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  validateLogin() {
    if (this.validarCampo(this.login)) {
      let NavigationExtras: NavigationExtras = {
        state: { login: this.login }
      };
      this.router.navigate(['/home'], NavigationExtras);
    }
  }

  validarCampo(model: any) {
    for (var [key, value] of Object.entries(model)) {
      console.log(key);
      if (value == "") {
        this.field = key;
        console.log(value);
        return false;
      }
    }
    return true;
  }

  ingresar() {
    if (this.validarCampo(this.login)) {
      const { usernameOrEmail, password } = this.login;

      this.authService.login(usernameOrEmail, password)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((error: any) => {
          this.presentAlert("Email o Contraseña incorrectos", "");
          console.error("Error en el inicio de sesión:", error);
        });
    } else {
      this.presentAlert("Columnas Vacías", "No puedes iniciar sesión. El campo: " + this.field + " está vacío");
    }
  }

  onLogin(): void {
    this.authService.login(this.login.usernameOrEmail, this.login.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        this.presentAlert("Email o Contraseña incorrectos", "");
        console.error("Error en el inicio de sesión:", error);
      });
  }
}
