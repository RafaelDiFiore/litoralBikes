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

  async getImages() {
    const imagesCollection = collection(this.db, 'images');
    const snapshot = await getDocs(imagesCollection);
    return snapshot.docs.map(doc => doc.data());
  }

  async getPublicImages() {
    const imagesCollection = collection(this.db, 'images');
    const q = query(imagesCollection, where("status", "==", "public"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }

  async uploadImage(file: File, data: any) {
    const storageRef = ref(this.storage, `images/${file.name}`);
    
    // Subir la imagen a Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Obtener la URL pública de la imagen
    const url = await getDownloadURL(storageRef);
  
    // Agrega la URL al objeto de datos
    const imageData = {
      ...data,
      url, // Guardar la URL completa en Firestore
    };
  
    // Guarda los datos en Firestore
    const docRef = doc(this.db, `images/${file.name}`);
    await setDoc(docRef, imageData);
  }
}