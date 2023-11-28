import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
  ) { }

  registrarUsuarioConInfo(email: string, password: string, userData: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user && user.email) {
          this.router.navigate(['']);
          const registeredUser = {
            names: userData.names,
            email: user.email,
            telefono: userData.telefono,
            edad: userData.edad
          };

          localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
        }

        return userCredential;
      })
  }

  // Agrege una función que verificar la existencia de un usuario
  verificarExistenciaUsuario(email: string): Promise<boolean> {
    return this.afAuth.fetchSignInMethodsForEmail(email)
      .then(signInMethods => {
        // Si signInMethods es un arreglo vacío, el usuario no existe
        return signInMethods.length > 0;
      });
  }

  // Agrege una función que muestra un mensaje de error con ToastController
  async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  
// Método para cerrar sesión
cerrarSesion(): Promise<void> {
  // Cierra la sesión en Firebase
  return this.afAuth.signOut()
    .then(() => {
      // Elimina la información del usuario y del vehículo del LocalStorage
      localStorage.removeItem('loggedUser');

      // Redirige al usuario a la página de inicio de sesión
      this.router.navigate(['main-login/login']);
    })
    .catch(error => {
      console.error('Error al cerrar sesión: ', error);
      throw error;
    });
}
    // Promesa que envia un correo de recuperación de contraseña
    enviarCorreoRecuperacion(email: string): Promise<void> {
      return this.afAuth.sendPasswordResetEmail(email);
    }

    iniciarSesion(email: string, password: string): Promise<any> {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
  
          if (user) {
            const UserLogged = {
              email: user.email,
            };
  
            localStorage.setItem('UserLogged', JSON.stringify(UserLogged));
  
            return userCredential;
          } else {
            throw new Error('Error al iniciar sesión');
          }
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            // Si el usuario no se encuentra, mostrar un mensaje diferente
            this.mostrarMensajeError('Usuario no existe en nuestros registros. Por favor, verifica el correo.');
          } else {
            // Si el error no es de "usuario no encontrado", mostrar el mensaje estándar
            this.mostrarMensajeError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
          }
          throw error;
        });
    }
}
