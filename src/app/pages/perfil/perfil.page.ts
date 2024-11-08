import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user:any;
  username:any;
  constructor(private authService:AuthService) { 
    this.user = this.authService.getUser();
    this.username = this.authService.getUsername();

  }

  ngOnInit() {
  }

}
