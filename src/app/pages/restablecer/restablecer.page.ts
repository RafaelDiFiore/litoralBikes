import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  email: string = '';

  alertButtons = ['buscar()']

  constructor(public router:Router,private alertController:AlertController, private authService:AuthService) { }

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email);
      // Muestra un mensaje al usuario indicando que se envió el correo
      console.log("Se ha enviado el correo para restablecer la contraseña.");
      this.presentAlert("Éxito", "Correo Enviado", "Se ha enviado un correo para restablecer la contraseña.");
    } catch (error) {
      const errorMessage = (error as Error).message || "Error desconocido"; // Aserción de tipo
      console.error("Error al intentar restablecer la contraseña:", errorMessage);
      this.presentAlert("Error", "Error al restablecer", errorMessage);
    }
  }
  
  ngOnInit() {
  }

  

  

  field:string=""
  validarCampo(model:any){
    for(var [key,value] of Object.entries(model)){
      console.log(key)
      if(value == ""){
        this.field = key;
        return false;
      }
    }
    return true;
  }

  requiredWord: string = '@gmail.com';
  desabilitarBtn(): boolean{
    const wordIndex = this.email.indexOf(this.requiredWord);

    // Si la palabra no está en el texto o no hay nada antes de ella
    if (wordIndex === -1 || wordIndex === 0) {
      return true;
    }

    // Verifica si hay algo antes de la palabra (diferente de espacios en blanco)
    const textBeforeWord = this.email.substring(0, wordIndex).trim();
    return textBeforeWord === '';
  }

  async presentAlert(titulo:string,sub_titulo:string,mensaje:string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: sub_titulo,
      message: mensaje,
      buttons: ['Action'],
    });

    await alert.present();
  }




  buscar(){
    if(this.validarCampo(this.email)){
      let NavigationExtras:NavigationExtras={
        state:{email: this.email}
      };
      this.router.navigate(['/login'],NavigationExtras);
    }else{
      this.presentAlert("Error- Columna Vacia", "no puedes buscar un usuario", "el siguiente campo: " + this.field + " esta vacio")
    }
    
  }

}
