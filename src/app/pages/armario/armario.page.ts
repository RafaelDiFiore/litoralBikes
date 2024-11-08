import { Component, OnInit } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";


@Component({
  selector: 'app-armario',
  templateUrl: './armario.page.html',
  styleUrls: ['./armario.page.scss'],
})


export class ArmarioPage implements OnInit {

  constructor(private storageService: StorageService) { }

  //Función: selección de archivo y subida
  async selecArchivoSubir(event: any) {
    const file = event.target.files[0]; //Esta linea es para obtener el archivo seleccionado
    const filePath = `imagenes/${file.name}`; //Define la ruta del storage


    const urlDescarga = await this.storageService.uploadFile(file, filePath);
    if (urlDescarga) {
      console.log("Archivo subido con éxito, URL de descarga:", urlDescarga);
    } else {
      console.log("No se pudo subir el archivo.");
    }
  }


  ngOnInit() {
  }

}
