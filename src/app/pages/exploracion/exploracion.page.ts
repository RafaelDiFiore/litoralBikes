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
    this.loadImages();
  }

  async loadImages() {
    try {
      const allImages = await this.firebaseService.getImages();
      // Filtra solo las imágenes públicas
      this.images = allImages.filter(image => image["status"] === 'public');
      
      // Mostrar las URLs de las imágenes en la consola
      this.images.forEach(image => {
        console.log('URL de la imagen pública:', image["url"]);
      });
  
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    }
  }
  
}