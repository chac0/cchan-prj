import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { OrderDocument } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionsService {

  constructor(private functions: AngularFireFunctions) { }

  payAnOrder({ id }: OrderDocument): Observable<OrderDocument> {
    return this.functions.httpsCallable('paymentAnOrder')({ id })
  }
}
