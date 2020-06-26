import { QrcodePage } from './../pages/qrcode/qrcode';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import {SignupPage} from "../pages/signup/signup";
import {HttpModule} from "@angular/http";
import {EventPage} from "../pages/event/event";
import {BuyTicketPage} from "../pages/buy-ticket/buy-ticket";
import {PaymentPage} from "../pages/payment/payment";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
      LoginPage,
      SignupPage,
      EventPage,
      BuyTicketPage,
      PaymentPage,
      QrcodePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot(),
      HttpClientModule,
      HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      LoginPage,
      SignupPage,
      EventPage,
      BuyTicketPage,
      PaymentPage,
      QrcodePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
