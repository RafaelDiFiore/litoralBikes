import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage {
  nombre: string = '';
  bicicleta: string = '';
  servicio: string = '';
  estado: string = '';
  qrCodeUrl: string = '';

  constructor(
    private firestore: Firestore,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  async submitForm() {
    // Datos del cliente
    const clienteData = {
      nombre: this.nombre,
      bicicleta: this.bicicleta,
      servicio: this.servicio,
      estado: this.estado,
      fecha: new Date().toISOString(), // Fecha del ingreso
    };

    try {
      // Guardar en Firestore en la colección 'clientes'
      const dbInstance = collection(this.firestore, 'clientes');
      const docRef = await addDoc(dbInstance, clienteData);

      // Generar código QR con el ID del documento y los datos
      const jsonData = encodeURIComponent(
        JSON.stringify({ id: docRef.id, ...clienteData })
      );
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${jsonData}&size=200x200`;

      // Mostrar alerta de éxito
      this.presentAlert(
        'Cliente agregado',
        '',
        'El cliente ha sido registrado correctamente en la base de datos y el código QR generado.'
      );

      // Limpiar campos después de guardar
      this.resetFields();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      this.presentAlert(
        'Error',
        '',
        'Ocurrió un error al guardar el cliente. Inténtalo nuevamente.'
      );
    }
  }

  async saveQRCode() {
    if (this.qrCodeUrl) {
      try {
        // Descargar la imagen del QR desde la URL
        const blob = await this.http
          .get(this.qrCodeUrl, { responseType: 'blob' })
          .toPromise();

        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64Data = reader.result?.toString().split(',')[1];
            if (base64Data) {
              // Guardar el QR como archivo en el dispositivo
              const fileName = `qr_code_${new Date().getTime()}.jpg`;
              await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });

              this.presentAlert(
                'Éxito',
                '',
                'El código QR ha sido guardado como imagen en tu dispositivo.'
              );
            }
          };
        }
      } catch (error) {
        console.error('Error al guardar QR:', error);
        this.presentAlert(
          'Error',
          '',
          'No se pudo guardar el código QR. Por favor, inténtalo nuevamente.'
        );
      }
    } else {
      this.presentAlert('Aviso', '', 'Primero debes generar el código QR.');
    }
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  resetFields() {
    this.nombre = '';
    this.bicicleta = '';
    this.servicio = '';
    this.estado = '';
    this.qrCodeUrl = '';
  }
}
