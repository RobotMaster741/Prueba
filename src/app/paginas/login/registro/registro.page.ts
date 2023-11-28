import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //variables 
  names: string = '';
  email: string = '';
  telefono: string = "";
  edad: string = "";
  password: string = '';
  confirmPassword: string = '';
  mostrarMensajeError: boolean = false;
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

    //Aqui hare una validacion para que la contrasennia tenga minimo 6 caracteres
   //que contenga 1 mayuscula, 2 numeros y un caracter especial pero
  validarPassword(password: string): boolean {
    // Aqui verificara que la contrasennia tenga 6 digitos como minimo
    if (password.length < 6) {
      return false;
    }
  
    // Aqui se verificara que la contrasennia contenga 1 mayuscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Aqui verificara que la contrasennia contenga 2 numeros
    if ((password.match(/[0-9]/g) || []).length < 2) {
      return false;
    }
  
    // Aqui se verificara que la contrasennia contenga 1 caracter especial
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return false;
    }
    //si todo se cumple entonces cumplira con todo y no saldra el mensaje pero si
    //no tiene todo el return false le enviara el mensaje de alerta
    return true;
  }

  async registrar() {
    //Aqui cree una logica en el cual si la contrasennia y el confirmar 
    //contrasennias no son iguales que envie un mensaje error y que no deje registrar hasta que sean iguales 
    if (this.password !== this.confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Las contraseñas no coinciden.',
        duration: 10000,
        position: 'top',
        color: 'danger',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cerrar Toast');
            },
          },
        ],
      });
      toast.present();
      return;
    }

    //Aqui cree una cadena que se usaran para verificar los campos vacios del form
    let camposFaltantes = '';
    //Aqui sera el mensaje error de los campos vacios
    let mensajeError = '';
    
    //Entonces si estos campos no estan llenos porque son obligatorios
    if (!this.names) {
      camposFaltantes += 'Nombre Completo, ';
    }

    if (!this.email) {
      camposFaltantes += 'Correo, ';
    }
    
    if (!this.telefono) {
      camposFaltantes += 'telefono, ';
    }

    if (!this.edad) {
      camposFaltantes += 'edad, ';
    }

    if (!this.password) {
      camposFaltantes += 'Contraseña, ';
    } else if (!this.validarPassword(this.password)) {
      mensajeError = 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 2 números y 1 carácter especial. ';
    }
  
    // Se encuentran dentro de estos campos algunos vacios,
    //muestre un mensaje solo los que falten como guia
    if (camposFaltantes) {
      camposFaltantes = camposFaltantes.slice(0, -2);
  
      // Aqui es la logica para el mensaje usando un controlador llamado 
      //ToastController
      const toast = await this.toastController.create({
        message: `Por favor, llena los siguientes campos: ${camposFaltantes}`,
        duration: 10000,
        position: 'top',
        color: 'danger',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cerrar Toast');
            },
          },
        ],
      });
      toast.present();
      //Aqui si la ejecucion de la logica se encuentran campos vacios o la contrasennia
      //que no cumple con los requisitos(invalida) que detenga la logica(funcion)
      return;
    }
  
    // Pero si hay un mensaje error en la contrasennia que muestre un 
    //mensaje de error solo a la contrasennia
    if (mensajeError) {
      // Aqui lo mismo que la logica de arriba el mensaje error contrasennia 
      //Usando el Controlador ToastController
      const toast = await this.toastController.create({
        message: mensajeError,
        duration: 10000,
        position: 'top',
        color: 'danger',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cerrar Toast');
            },
          },
        ],
      });
      toast.present();
      // Aqui si la ejecucion de la logica en la contrasennia se encuentra no cumpla
      //con los requisitos que detenga la funcion
      return;
    }
  
    // SI todos los campos estan llenos y la contrasennia es válida, que el usuario
    // Pueda continuar con el registro del usuario
    // Y que este registre al usuario en el Firebase y guarde información adicional en el localStorage
    this.authService
      .registrarUsuarioConInfo(this.email, this.password, {
        names: this.names,
        email: this.email,
        telefono: this.telefono,
        edad: this.edad,
      })
      .then(() => {
        // Entonces si todo fue con existo
        // que rediriga al usuario a la página "deben crear el menu con las disponibilidad y registro"
        this.navCtrl.navigateForward('menu-principal/menu');
      })
  }
}