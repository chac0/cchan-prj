import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore, AngularFirestoreDocument, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductInfoDocument } from '../models';
import {LocalStorageService} from '../services/local-storage.service';


@Injectable({
    providedIn: 'root'
  })
  export class ProductInfoDocRepository {
  
    private ROOT_PATH = 'products';
    private COLLECTION_PATH = 'products';
  
    constructor(
        private firestore: AngularFirestore,
        private localStorage: LocalStorageService,
        private cloudFunctions: AngularFireFunctions,
        ) 
    {
    }
  
    findById(id: string): Observable<ProductInfoDocument> {
      const afc: AngularFirestoreDocument<ProductInfoDocument> = this.firestore.collection(this.ROOT_PATH).doc(id);
      return afc.valueChanges();
    }
    //===============================
    //リスト取得
    //===============================
    getList( shopID:string ): Observable<ProductInfoDocument[]>{
        const dbRef = this.firestore.collection( this.ROOT_PATH,  ref => ref.where('shopId', '==', shopID) );
        return dbRef.valueChanges().pipe(map(products=> products as ProductInfoDocument[]));
    }
    //===============================
    // 1回だけリストを取得する用
    //===============================
    async getListOnce( shopID:string ): Promise<ProductInfoDocument[]> {

        const ref = this.firestore.collection( this.ROOT_PATH, ref => ref.where('shopId', '==', shopID) );
        const data = await ref.get().toPromise();
        return data.docs.map<ProductInfoDocument>(doc => this.toProduct(doc))
    }

    async setProducts( shopID:string, products:ProductInfoDocument[] )
    {
        const data = {
            shopId: shopID
            ,products: products
        }
        return this.cloudFunctions.httpsCallable('setProducts')(data).toPromise();
    }

    private toProduct(doc: QueryDocumentSnapshot<DocumentData>) {
        return new ProductInfoDocument(doc.data());
    }
  
}
