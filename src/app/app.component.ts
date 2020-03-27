import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
import  { LoginpagePage } from './../pages/loginpage/loginpage'
import { HomePage } from '../pages/home/home';

import { OrderpagePage } from '../pages/orderpage/orderpage';

import { SignupPage } from '../pages/signup/signup';
import { ChatPage } from '../pages/chat/chat';
import {ChatroomlistPage} from '../pages/chatroomlist/chatroomlist'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = HomePage;
  rootPage:any=HomePage;

  constructor(platform: Platform/* , statusBar: StatusBar, splashScreen: SplashScreen */) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();
    });
  }
}

