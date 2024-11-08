import { Injectable } from '@angular/core';
import { getAuth, sendPasswordResetEmail ,onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any; // Variable para almacenar la información del usuario
  private username: string | null = null; // Para almacenar el nombre de usuario

  private auth = getAuth();
  private db = getFirestore();

  constructor() {
    this.loadUserFromLocalStorage(); // Cargar el usuario al iniciar el servicio

    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        // La persistencia se ha configurado correctamente
        onAuthStateChanged(this.auth, (user) => {
          if (user) {
            console.log("Usuario autenticado:", user);
          } else {
            console.log("No hay usuario autenticado");
          }
        });
      })
      .catch((error) => {
        console.error("Error al establecer la persistencia:", error);
      });
  }

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

      // Almacena el nombre de usuario y el usuario en localStorage
      this.username = username;
      this.user = userCredential.user;
      localStorage.setItem('user', JSON.stringify(this.user));
      return userCredential;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

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
          localStorage.setItem('user', JSON.stringify(this.user)); // Guardar en localStorage
        })
        .catch((error) => {
          console.error("Error de inicio de sesión:", error);
          throw error;
        });
    } else {
      throw new Error("Email no encontrado");
    }
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private loadUserFromLocalStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user); // Recuperar el usuario del localStorage
      this.username = this.user.username; // Cargar el nombre de usuario si está disponible
    }
  }

  getUser() {
    return this.user; // Método para obtener el usuario
  }

  getUsername(): string | null {
    return this.username; // Devuelve el nombre de usuario
  }

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
