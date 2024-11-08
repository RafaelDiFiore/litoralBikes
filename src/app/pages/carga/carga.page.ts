import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.page.html',
  styleUrls: ['./carga.page.scss'],
})
export class CargaPage {
  selectedFile: File | null = null;
  title = '';
  author = '';
  description = '';
  status = 'public'; // o 'private'
  tags: string = '';

  constructor(private firebaseService: FirebaseService, private alertController: AlertController) { }

  ngOnInit() {}

  async presentAlert(titulo:string,sub_titulo:string,mensaje:string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: sub_titulo,
      message: mensaje,
      buttons: ['Action'],
    });
    //este genera la alerta y la pone en espera(para cuando se active)
    await alert.present();
  }

  //funcion para tomar una imagen
  async tomarFoto() {
    try {
      //Llama a la camara para tomar la foto
      const foto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, //obtiene la img en base64
        source: CameraSource.Camera //abre la camara
      });

      //Mostrar la img en la app
      const img = document.getElementById('capturedImage') as HTMLImageElement;
      if (img && foto.dataUrl) {
        img.src = foto.dataUrl; //coloca imagen capturada en img
      }

      //Llama a la función para subir la foto a la Firebase
      //if (foto.dataUrl) {
      //  await this.uploadImage(foto.dataUrl);
      //}
    } catch (error) {
      console.error('Error al capturar la foto', error);
    }
  }



  

    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length) {
        this.selectedFile = target.files[0];
      }

    }

  async uploadImage() {
      if (this.selectedFile) {
        const data = {
          title: this.title,
          author: this.author,
          description: this.description,
          status: this.status,
          tags: this.tags.split(',').map(tag => tag.trim()), // Divide y limpia etiquetas
        };

        await this.firebaseService.uploadImage(this.selectedFile, data);
        this.presentAlert("IMAGEN SUBIDA EXITOSAMENTE", "se subio la imagen a la base de datos", "");
        this.resetFields();
      }
    }

    resetFields() {
      this.selectedFile = null;
      this.title = '';
      this.author = '';
      this.description = '';
      this.status = 'public';
      this.tags = '';
    }
}
