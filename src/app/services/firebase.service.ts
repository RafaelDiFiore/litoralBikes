import { Injectable } from '@angular/core';
import { doc, setDoc, getFirestore, collection, addDoc, getDocs,  query, where } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore(initializeApp(environment.firebaseConfig));
  private storage = getStorage(initializeApp(environment.firebaseConfig));

  constructor() {}
  async addClient(data: any): Promise<void> {
    try {
      // Define la referencia de la colección 'clients'
      const clientsCollection = collection(this.db, 'clients');
      
      // Añade un nuevo documento con los datos recibidos
      await addDoc(clientsCollection, data);
      console.log('Cliente agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el cliente:', error);
      throw error;
    }


  }
  }