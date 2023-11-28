import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.page.html',
  styleUrls: ['./iniciar.page.scss'],
})
export class IniciarPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  iniciarSesion() {
    // Aqui se vera la utenticacion del usuario con el servicio auth
    this.authService.iniciarSesion(this.email, this.password)
      .then(() => {
        // Si el usuario ha iniciado con exito aqui que lo rediriga a la pagina agreguen a donde quieren que lo rediriga
        this.navCtrl.navigateForward('menu-principal/menu');
      })
  }
}
