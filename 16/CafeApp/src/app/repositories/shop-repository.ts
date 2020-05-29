import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShopDocument } from '../models';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShopDocRepository {


  private ROOT_PATH = 'shops';

  constructor(
      private firestore: AngularFirestore,
      private localStorage: LocalStorageService,
      ) 
  {
  }

  findById(id: string): Observable<ShopDocument> {
    const afc: AngularFirestoreDocument<ShopDocument> = this.firestore.collection(this.ROOT_PATH).doc(id);
    return afc.valueChanges();
  }

  create( newData: ShopDocument) {
    const newId = this.firestore.createId();
    newData.id = newId;
    return this.firestore.collection(this.ROOT_PATH).doc( newId ).set( Object.assign({},newData) );
  }

  update(id: string, data: ShopDocument) {
    return this.firestore.collection(this.ROOT_PATH).doc(id).update(Object.assign({}, data))
    .then(value=>{
      this.localStorage.setShopDocument(data);
      return Promise.resolve(value);
    }).catch(error=>{
      return Promise.reject(error);
    });
  }

  //====================================
  // loginmailで検索してショップ情報を取得
  //====================================
  findByLoginMail( loginMail:string ): Observable<ShopDocument[]>{

    const afc:AngularFirestoreCollection<ShopDocument> = this.firestore.collection(this.ROOT_PATH, ref => ref.where('loginMail', '==', ''+ loginMail ));
    return afc.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        );
  }

  async getListOnce( loginMail:string ): Promise<ShopDocument[]> {
      const ref = this.firestore.collection( this.ROOT_PATH,  ref => ref.where('loginMail', '==', loginMail).limit(1) );
      const data = await ref.get().toPromise();
      return data.docs.map<ShopDocument>(doc => this.toShop(doc))
  }

  private toShop(doc: QueryDocumentSnapshot<DocumentData>) {
    //return Object.assign({}, doc.data()) as ProductInfoDocument;
    return new ShopDocument(doc.data());
  }
}
