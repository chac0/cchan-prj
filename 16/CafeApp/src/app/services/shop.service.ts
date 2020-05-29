import { Injectable } from '@angular/core';
import { ShopDocument } from '../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  
  private shopData = new Subject<ShopDocument>();
  public shopData$ = this.shopData.asObservable();  
  constructor() { }
  public onNotifySharedDataChanged(data: ShopDocument) {
    console.log('');
    this.shopData.next(data);
  }

}
