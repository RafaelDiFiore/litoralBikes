import { Component } from '@angular/core';
import { register  } from 'swiper/element/bundle';
import { AuthService } from './services/auth.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    // Inicializa el AuthService que hará la verificación de autenticación
  }

  SwiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
}
