import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Rave, RavePayment, Misc } from 'rave-ionic3';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserObject } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private rave: Rave, 
    private ravePayment: RavePayment, 
    private misc: Misc,
    private iab: InAppBrowser,
    public alertCtrl: AlertController) {

  }

  pay(){
    this.rave.init(false, "FLWPUBK-6dd4c6b468197482502fd07b15992a8a-X")
      .then(_ => {
        var paymentObject = this.ravePayment.create({
          customer_email: "olophaayomide@gmail.com.com",
          amount: 50,
          customer_phone: "23407064664695",
          currency: "NGN",
          subaccounts: [
            {
              id: "RS_44A014E265FDEF85A0AB6742932A90F6",  
            }, 
          ],
          txref: "rave-123456",
          meta: [{
              metaname: "flightID",
              metavalue: "AP1234"
          }]
      })
        this.rave.preRender(paymentObject)
          .then(secure_link => {
            secure_link = secure_link +" ";
            const browser: InAppBrowserObject = this.rave.render(secure_link, this.iab);
            browser.on("loadstop")
                .subscribe((event: InAppBrowserEvent) => {
                  if(event.url.indexOf('https://your-redirect-url') != -1) {
                    if(this.rave.paymentStatus(event.url) == 'failed') {
                      this.alertCtrl.create({
                        title: "Message",
                        message: "Oops! Transaction failed"
                      }).present();
                    }else {
                      this.alertCtrl.create({
                        title: "Message",
                        message: "Transaction successful"
                      }).present();
                    }
                    browser.close()
                  }
                })
          }).catch(error => {
            // Error or invalid paymentObject passed in
            this.alertCtrl.create({
              message: "An Error Occurred! Please try again later."
            });
          })
      })

  }

}
