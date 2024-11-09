import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para hacer la solicitud a la URL del QR
import { AlertController } from '@ionic/angular'; // Importa AlertController para mostrar las alertas

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

  constructor(private http: HttpClient, private alertController: AlertController) {}

  submitForm() {
    const data = {
      nombre: this.nombre,
      bicicleta: this.bicicleta,
      servicio: this.servicio,
      estado: this.estado
    };

    // Codifica el JSON a una cadena URL
    const jsonData = encodeURIComponent(JSON.stringify(data));

    // Genera la URL de la imagen QR con los datos del JSON
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${jsonData}&size=200x200`;

    // Mostrar el mensaje de confirmación de cliente agregado
    this.presentAlert('Cliente agregado exitosamente', '', 'El cliente ha sido agregado a la base de datos y el código QR ha sido generado.');
  }

  // Método para mostrar alertas
  async presentAlert(titulo: string, subTitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async saveQRCode() {
    if (this.qrCodeUrl) {
      try {
        // Descarga la imagen del QR desde la URL
        const blob = await this.http.get(this.qrCodeUrl, { responseType: 'blob' }).toPromise();
        
        if (blob) {
          // Convierte el blob a base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64Data = reader.result?.toString().split(',')[1];

            if (base64Data) {
              // Guarda la imagen como archivo en el dispositivo
              const fileName = `qr_code_${new Date().getTime()}.jpg`;
              await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
              });

              console.log('QR Code guardado como imagen JPG.');
              alert('El código QR ha sido guardado como una imagen en tu dispositivo.');

              // Limpiar los campos del formulario y la URL del QR
              this.resetFields();
            }
          };
        }
      } catch (error) {
        console.error('Error al generar o guardar el QR:', error);
        alert('No se pudo guardar la imagen del código QR.');
      }
    } else {
      alert('Primero debes generar el código QR.');
    }
  }

  // Método para limpiar los campos del formulario
  resetFields() {
    this.nombre = '';
    this.bicicleta = '';
    this.servicio = '';
    this.estado = '';
    this.qrCodeUrl = '';
  }
}
