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
  estado: string = 'pendiente'; // Estado predeterminado

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  // Método para manejar el envío del formulario
  async submitForm() {
    if (this.nombre && this.bicicleta && this.servicio && this.estado) {
      try {
        // Datos a guardar en Firebase
        const data = {
          nombre: this.nombre,
          bicicleta: this.bicicleta,
          servicio: this.servicio,
          estado: this.estado,
        };

        // Llama al servicio de Firebase para guardar los datos
        await this.firebaseService.addClient(data);

        // Muestra una alerta de éxito
        await this.presentAlert(
          'Cliente Ingresado',
          '',
          'El cliente ha sido ingresado correctamente.'
        );

        // Resetea los campos del formulario
        this.resetForm();
      } catch (error) {
        console.error('Error al ingresar el cliente:', error);
        await this.presentAlert(
          'Error',
          '',
          'Hubo un error al ingresar el cliente. Por favor, inténtalo nuevamente.'
        );
      }
    } else {
      // Si falta algún campo, muestra un mensaje de error
      await this.presentAlert(
        'Formulario Incompleto',
        '',
        'Por favor, completa todos los campos.'
      );
    }
  }

  // Método para mostrar una alerta
  async presentAlert(titulo: string, subTitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para resetear los campos del formulario
  resetForm() {
    this.nombre = '';
    this.bicicleta = '';
    this.servicio = '';
    this.estado = 'pendiente'; // Estado predeterminado
  }
}
