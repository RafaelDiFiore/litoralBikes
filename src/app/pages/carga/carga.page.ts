import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
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



  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }




  async scanQR() {
    try {
      // Pide permiso para acceder a la cámara
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan(); // Te devolverá el resultado del escaneo

        BarcodeScanner.showBackground();

        if (result?.hasContent) {
          console.log('Contenido del QR:', result.content);
         
        }
      } else {
        console.log('Permiso no concedido');
      }
    } catch (error) {
      console.error('Error al escanear el QR:', error);
    }
  }
}
