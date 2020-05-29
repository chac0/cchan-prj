import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserDocument } from '../models/user';
import { Observable } from 'rxjs';
import { ShippingAddress } from '../models/shipping-address';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressDocRepository {

  private ROOT_PATH = 'shippingAddresses';

  constructor(private firestore: AngularFirestore) { }

  findAll(): Observable<ShippingAddress[]> {
    return this.firestore
      .collectionGroup(this.ROOT_PATH)
      .valueChanges() as Observable<ShippingAddress[]>
  }
}
