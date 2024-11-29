import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  registrar: any = {
    nombre: "",
    email: "",
    password: ""
  };

  registerForm: FormGroup;

  constructor(
    public router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async register() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      try {
        // Intentar registrar el usuario usando AuthService
        await this.authService.registerUser(username, email, password);

        // Mostrar mensaje de éxito al usuario
        await this.presentAlert("Registro exitoso", "", "Usuario registrado exitosamente.");

        // Redirigir a la página de inicio después de la confirmación
        this.router.navigate(['/home']);
      } catch (error: any) {
        // Asegurarse de que el error sea tratado como un objeto
        if (error && error.code === 'auth/email-already-in-use') {
          await this.presentAlert("Error de registro", "", "El correo electrónico ya está en uso. Por favor, use otro correo.");
        } else if (error && error.message === 'El nombre de usuario ya está en uso') {
          await this.presentAlert("Error de registro", "", "El nombre de usuario ya está en uso. Por favor, elija otro nombre.");
        } else {
          await this.presentAlert("Error de registro", "", "Hubo un error al registrar el usuario. Por favor, inténtelo nuevamente.");
        }
      }
    }
  }

  field: string = "";

  validarCampo(model: any) {
    for (var [key, value] of Object.entries(model)) {
      if (value === "") {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  async presentAlert(titulo: string, sub_titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: sub_titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  registrarse() {
    if (this.validarCampo(this.registrar)) {
      // Si los campos están completos, llama a la función register()
      this.register();
    } else {
      // Si hay algún campo vacío, mostrar una alerta
      this.presentAlert("Columnas Vacias", "No puedes iniciar sesión", `El siguiente campo: ${this.field} está vacío`);
    }
  }
}
