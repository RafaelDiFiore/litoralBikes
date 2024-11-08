import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-exploracion',
  templateUrl: './exploracion.page.html',
  styleUrls: ['./exploracion.page.scss'],
})
export class ExploracionPage implements OnInit {
  images: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
  
  }

  
}