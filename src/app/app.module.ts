import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BarraComponent } from './components/barra/barra.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, BarraComponent],//se añade el componente para ser usado en routing module
  imports: [BrowserModule, IonicModule.forRoot(),HttpClientModule, AppRoutingModule, IonicStorageModule.forRoot(), ReactiveFormsModule, FormsModule],



  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  
  constructor() {
  // Inicializar Firebase con la configuración desde environment
  initializeApp(environment.firebaseConfig);
}
}