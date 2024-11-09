import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service'; // Asumiendo que tienes un servicio Firebase configurado para manejar las interacciones con la base de datos

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
  }
}
