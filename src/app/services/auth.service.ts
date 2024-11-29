import { Injectable } from '@angular/core';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any; // Variable para almacenar la información del usuario
  private username: string | null = null; // Para almacenar el nombre de usuario

  private auth = getAuth();
  private db = getFirestore();

  constructor(private router: Router) {
    this.loadUserFromPreferences(); // Cargar el usuario al iniciar el servicio

    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        // La persistencia se ha configurado correctamente
        onAuthStateChanged(this.auth, (user) => {
          if (user) {
            console.log("Usuario autenticado:", user);
            this.user = user;
            this.username = user.displayName || null; // Actualiza el nombre de usuario si existe en el displayName
            this.saveUserToPreferences(); // Guarda el usuario en Preferencias para mantener la sesión
          } else {
            console.log("No hay usuario autenticado");
          }
        });
      })
      .catch((error) => {
        console.error("Error al establecer la persistencia:", error);
      });
  }

  // Registro de usuario
  async registerUser(username: string, email: string, password: string) {
    try {
      // Verifica si el nombre de usuario ya existe
      const usernameRef = doc(this.db, 'users', username);
      const usernameDoc = await getDoc(usernameRef);

      if (usernameDoc.exists()) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crea el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Guarda los datos del usuario en Firestore usando el nombre de usuario como clave
      await setDoc(doc(this.db, 'users', username), {
        uid: uid,  // Guarda el uid para futuras referencias
        email: email,
        username: username // Guarda el nombre de usuario
      });

      // Almacena el nombre de usuario y el usuario en Preferences
      this.username = username;
      this.user = userCredential.user;
      await this.saveUserToPreferences();
      
      return userCredential;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

  // Inicio de sesión
  async login(usernameOrEmail: string, password: string): Promise<void> {
    let email: string | null = null;

    // Verificar si es un email o un nombre de usuario
    if (this.isValidEmail(usernameOrEmail)) {
      email = usernameOrEmail;
    } else {
      // Si no es un email, buscar en Firestore por nombre de usuario
      const userRef = doc(this.db, 'users', usernameOrEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        email = userDoc.data()?.["email"];
        this.username = usernameOrEmail; // Asigna el nombre de usuario
      } else {
        console.error("Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }
    }

    if (email) {
      return signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          this.username = usernameOrEmail;
          this.saveUserToPreferences(); // Guardar en Preferences
        })
        .catch((error) => {
          console.error("Error de inicio de sesión:", error);
          throw error;
        });
    } else {
      throw new Error("Email no encontrado");
    }
  }

  // Método para verificar si un email es válido
  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Cargar usuario desde Preferences
  private async loadUserFromPreferences(): Promise<void> {
    const user = await Preferences.get({ key: 'user' });
    if (user.value) {
      this.user = JSON.parse(user.value); // Recuperar el usuario del Preferences
      this.username = this.user.displayName || this.user.username || null; // Cargar el nombre de usuario si está disponible
    }
  }

  // Guardar usuario en Preferences
  private async saveUserToPreferences(): Promise<void> {
    if (this.user) {
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(this.user)
      });
    }
  }

  // Método para obtener el usuario actual
  getUser() {
    return this.user;
  }

  // Método para obtener el nombre de usuario
  getUsername(): string | null {
    return this.username;
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log("Correo de restablecimiento de contraseña enviado a:", email);
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
      throw error;
    }
  }
}
