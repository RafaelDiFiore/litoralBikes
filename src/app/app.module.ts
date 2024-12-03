import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { BarraComponent } from './components/barra/barra.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, BarraComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Proveedor para Firebase App
    {
      provide: 'FIREBASE_APP',
      useFactory: () =>
        !getApps().length
          ? initializeApp(environment.firebaseConfig)
          : getApp(),
    },
    // Proveedor para Firestore
    {
      provide: 'FIRESTORE',
      useFactory: (firebaseApp: any) => getFirestore(firebaseApp),
      deps: ['FIREBASE_APP'],
    },
    // Proveedor para Auth
    {
      provide: 'FIREBASE_AUTH',
      useFactory: (firebaseApp: any) => getAuth(firebaseApp),
      deps: ['FIREBASE_APP'],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
