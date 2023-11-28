import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Tu código de inicialización, si es necesario.
  }
  
  async mostrarConfirmacionCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Esta seguro de querer regresar a home?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesion();
          },
        },
      ],
    });
    
    await alert.present();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        console.error('Error al cerrar sesión: ', error);
      });
  }
}
