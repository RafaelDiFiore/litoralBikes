import { Injectable } from '@angular/core';
import { getStorage,ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage(initializeApp(environment.firebaseConfig));

  constructor() { }
  
  // Esta función es para subir los archivos al Firebase Storage
  async uploadFile(file: File, filePath: string) {
    try {
      // Aquí creamos una referencia en el Storage
      const storageRef = ref(this.storage, filePath);

      // Subir el archivo
      const subeArchivo = await uploadBytes(storageRef, file);
      console.log("Se subió el archivo correctamente");

      // URL de descarga
      const urlDescarga = await getDownloadURL(subeArchivo.ref);
      console.log("URL de descarga:", urlDescarga);
      return urlDescarga; // Aquí devuelve la URL para usarla en la App
    } catch (error) {
      console.error("Ocurrió un error al subir el archivo", error);
      return null;
    }
  }
}