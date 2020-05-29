import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private cloudFunctions: AngularFireFunctions) { }

  sendMailWhenOrdered(parameter: { orderId: string }) {
    return this.cloudFunctions.httpsCallable('sendMailWhenOrdered')(parameter).toPromise()
  }

  sendMailWhenApology(parameter: { id: string, productId: string }) {
    return this.cloudFunctions.httpsCallable('sendMailWhenApology')(parameter).toPromise()
  }

  sendMailWhenKeepStock(parameter: { id: string }) {
    return this.cloudFunctions.httpsCallable('sendMailWhenKeepStock')(parameter).toPromise()
  }
}
