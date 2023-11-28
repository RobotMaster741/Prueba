import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email: string = '';
  mensaje: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  enviarCorreoRecuperacion() {
    this.authService.enviarCorreoRecuperacion(this.email)
      .then(() => {
        this.mensaje = 'El correo de restablecimiento se envió con éxito.';
        setTimeout(() => {
          this.mensaje = '';
          this.navCtrl.navigateBack('login/iniciar');
        }, 3000);
      })
  }

}
