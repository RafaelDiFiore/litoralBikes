import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import jsQR from 'jsqr';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.page.html',
  styleUrls: ['./carga.page.scss'],
})

export class CargaPage {
  title: string = '';
  author: string = '';
  description: string = '';
  status: string = '';

  constructor() {}

  async scanQrCode() {
    try {
      // Captura la imagen
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      // Crea un elemento canvas para procesar la imagen
      const img = new Image();
      img.src = image.dataUrl!;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context?.drawImage(img, 0, 0, img.width, img.height);

        // Decodifica el QR
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);

          if (qrCodeData) {
            const data = JSON.parse(qrCodeData.data);
            this.title = data.nombre || '';
            this.author = data.bicicleta || '';
            this.description = data.servicio || '';
            this.status = data.estado || '';
          } else {
            console.log("No se pudo leer el código QR.");
          }
        }
      };
    } catch (error) {
      console.error("Error al capturar o procesar el código QR:", error);
    }
  }
}