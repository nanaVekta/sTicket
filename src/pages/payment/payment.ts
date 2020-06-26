import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { QrcodePage } from '../qrcode/qrcode';


@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public ticket_user_id : any;
  public ticketData : any;
  resultData : any;
  public quantity : any;
  public paymentData = {"user_id":"","token":"","amount":"", "account_name":"", "number":"", "payment_type":"", "event_name":"", "type":"", "eventId":"", "affiliation":"", "quantity":"", "date":"", "voucher":""};


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private authService: AuthServiceProvider,
    private toastCtrl: ToastController) {
    this.storage.get('sTUserData')
    .then((res)=>{
      if(res){
        this.paymentData.account_name = res.userData.username;
        this.paymentData.user_id = res.userData.user_id;
        this.paymentData.token = res.userData.token;

      }
      else{
        this.navCtrl.setRoot(LoginPage);
      }
    })

      this.storage.get('sTTicketData').then((result) => {
        if(result){
            this.ticketData = result;
            this.paymentData.event_name = this.ticketData.eventName;
            this.ticket_user_id = this.ticketData.user_id;
            this.paymentData.amount = this.ticketData.total;
            this.paymentData.type = this.ticketData.type;
            this.paymentData.eventId = this.ticketData.eventId;
            this.paymentData.date = this.ticketData.date;
            this.paymentData.quantity = this.ticketData.quantity;
            this.paymentData.affiliation = this.ticketData.affiliation;
  
            if(this.ticket_user_id != this.paymentData.user_id){
              this.navCtrl.setRoot(HomePage);
            }
        }
        else{
          this.navCtrl.setRoot(HomePage);
        }
    })
  }

  confirmPayment(type) {

    if(type == 'VDF'){
      let alert = this.alertCtrl.create({
        title: "Make Payment",
        message: 'Enter your wallet number and voucher number. A prompt will be sent for you to confirm.',
        inputs: [
          {
            name: 'momoNumber',
            type: 'number',
            label: 'VCash Number',
            placeholder: "VCash number"
          },
          {
            name: 'voucher',
            type: 'text',
            label: 'Voucher Number',
            placeholder: 'Voucher number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancelled');
            }
          },
          {
            text: 'Proceed',
            handler: (data) => {
              if((data.momoNumber == "" || data.momoNumber == null || data.momoNumber == ' ') && (data.voucher == "" || data.voucher == null || data.voucher == ' ')){
                this.presentToast("Enter your wallet number and voucher")
              }
              else{
                let loading = this.loadingCtrl.create({
                  content: 'processing...'
                });

                loading.present();

                this.paymentData.number = data.momoNumber;
                this.paymentData.payment_type = type;
                this.paymentData.voucher = data.voucher;

                this.authService.postData(this.paymentData,'payment').then((result) => {
                  loading.dismiss();
                  this.resultData = result;
                  console.log(this.resultData);
                  if(this.resultData.success){
                    this.navCtrl.push(QrcodePage)
                  }
                  else  {
                    this.storage.set('sTError', this.resultData);
                    setTimeout(() => this.storage.get('sTError').then(data=> {
                      if (data) {

                        let errorDetails = data.error;
                        this.presentConfirm(errorDetails.text);
                      }
                    }), 1000);
                  }

                }, (err) => {
                  loading.dismiss();

                  this.presentConfirm("No or slow internet connection "+err)
                });
              }

            }
          }
        ]
      });
      alert.present();
    }
    else{
      let alert = this.alertCtrl.create({
        title: "Make Payment",
        message: 'Enter your wallet number and a prompt will be sent to you for you to confirm. Be sure to accept before a minute pass.',
        inputs: [
          {
            name: 'momoNumber',
            type: 'number',
            label: 'Momo Number',
            placeholder: 'Momo Number',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancelled');
            }
          },
          {
            text: 'Proceed',
            handler: (data) => {
              if(data.momoNumber == "" || data.momoNumber == null || data.momoNumber == ' '){
                this.presentToast("Enter your wallet number")
              }
              else{
                let loading = this.loadingCtrl.create({
                  content: 'processing...'
                });


                loading.present();

                this.paymentData.number = data.momoNumber;
                this.paymentData.payment_type = type;

                this.authService.postData(this.paymentData,'payment').then((result) => {
                  loading.dismiss();
                  this.resultData = result;
                  console.log(this.resultData);
                  if(this.resultData.success){
                    this.navCtrl.push(QrcodePage)
                  }
                  else  {
                    this.storage.set('blutixError', this.resultData);
                    setTimeout(() => this.storage.get('blutixError').then(data=> {
                      if (data) {

                        let errorDetails = data.error;
                        this.presentConfirm(errorDetails.text);
                      }
                    }), 1000);
                  }
                }, (err) => {
                  loading.dismiss();

                  this.presentConfirm("No or slow internet connection "+err)
                });
              }

            }
          }
        ]
      });
      alert.present();
    }

  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message : msg,
      duration : 5000,
      position : "bottom"
    });

    toast.present();
  }

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      message: message,
      title: 'Error',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    });
    alert.present();
  }


}
