import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {PaymentPage} from "../payment/payment";

@Component({
  selector: 'page-buy-ticket',
  templateUrl: 'buy-ticket.html',
})
export class BuyTicketPage {

  ticketData = {"user_id":"", "token":"", "eventId":"", "type":"standard","quantity":1,"total":0,"date":"", "eventName":"", "affiliation":"home"};
  eventName : any;
  standardPrice : any;
  vipPrice : any;
  vvipPrice : any;
  quantity : number = 1;
  totalAmt : any = 0;
  vipTicket : any = 0;
  vvipTicket : any = 0;
  standardTicket : any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view : ViewController, public alertCtrl : AlertController, public toastCtrl : ToastController, public storage : Storage) {
  }

  ionViewDidLoad() {
    this.ticketData.user_id = this.navParams.get('userId');
    this.ticketData.eventId = this.navParams.get('eventId');
    this.ticketData.token = this.navParams.get('token');
    this.eventName = this.navParams.get('eventName');
    this.standardPrice = this.navParams.get('standardPrice');
    this.vipPrice = this.navParams.get('vipPrice');
    this.vvipPrice = this.navParams.get('vvipPrice');
    this.totalAmt = this.navParams.get('standardPrice');
    this.vipTicket = this.navParams.get('vipTicket');
    this.vvipTicket = this.navParams.get('vvipTicket');
    this.standardTicket = this.navParams.get('standardTicket');
    this.ticketData.date = this.navParams.get('eventDate');
  }

  closeModal(){
    this.view.dismiss();
  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      message: 'Are you sure you want to purchase this ticket?',
      buttons: [
        {
          text: 'N0',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.ticketData.quantity = this.quantity;
            this.ticketData.total = this.totalAmt;
            this.ticketData.eventName = this.eventName;

            this.storage.set('sTTicketData', this.ticketData);
            //this.navCtrl.push(QrcodePage);
            this.navCtrl.push(PaymentPage);
          }
        }
      ]
    });
    alert.present();
  }


  increaseQuantity(){
    //check ticket type
    if(this.ticketData.type == "standard"){
      if(this.ticketData.quantity > this.standardTicket){
        this.presentToast("Maximum tickets reached")
      }
      else if(this.ticketData.quantity > 6){
        this.presentToast("You can only buy 6 tickets.")
      }
      else{
        this.quantity ++;
        this.totalAmt = this.quantity * parseFloat(this.standardPrice)
      }
    }
    if(this.ticketData.type == "vvip"){
      if(this.ticketData.quantity > this.vvipTicket){
        this.presentToast("Maximum tickets reached")
      }
      else if(this.ticketData.quantity > 2){
        this.presentToast("You can only buy 2 tickets.")
      }
      else{
        this.quantity ++;
        this.totalAmt = this.quantity * parseFloat(this.vvipPrice)
      }
    }
    else{
      if(this.ticketData.quantity > this.vipTicket){
        this.presentToast("Maximum tickets reached")
      }
      else if(this.ticketData.quantity > 4){
        this.presentToast("You can only buy 4 tickets.")
      }
      else{
        this.quantity ++;
        this.totalAmt = this.quantity * parseFloat(this.vipPrice)
      }
    }
  }

  decreaseQuantity(){

    if(this.quantity == 1){
      this.presentToast("Minimum tickets reached")
    }
    else{
      if(this.ticketData.type == "standard"){
        this.quantity --;
        this.totalAmt = this.quantity * parseFloat(this.standardPrice)
      }
      else if(this.ticketData.type == "vvip"){
        this.quantity --;
        this.totalAmt = this.quantity * parseFloat(this.vvipPrice)
      }
      else{
        this.quantity --;
        this.totalAmt = this.quantity * parseFloat(this.vipPrice)
      }
    }
  }

  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  onChange(value){
    if(value == 'standard'){
      this.totalAmt = this.quantity * parseFloat(this.standardPrice)
    }
    if(value == 'vvip'){
      this.totalAmt = this.quantity * parseFloat(this.vvipPrice)
    }
    else{
      this.totalAmt = this.quantity * parseFloat(this.vipPrice)
    }
  }
}
