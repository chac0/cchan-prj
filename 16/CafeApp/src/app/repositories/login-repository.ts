import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LoginDocument } from '../models';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LoginDocRepository {


    private ROOT_PATH:string = 'Product Document';

    constructor(private firestore: AngularFirestore) { }

    findAll(): Observable<LoginDocument[]> {
        return this.firestore.collection( this.ROOT_PATH ).valueChanges()
                  .pipe(map(products => products as LoginDocument[]));
      }

    list(): Observable<LoginDocument[]> {
      const afc: AngularFirestoreCollection<LoginDocument> = this.firestore.collection( this.ROOT_PATH , ref => ref.orderBy('price'));
      return afc.valueChanges().pipe( map(products => products as LoginDocument[]));
    }

    findByName(name: string): Observable<LoginDocument[]> {
      const afc: AngularFirestoreCollection<LoginDocument> = this.firestore.collection( this.ROOT_PATH, ref => ref.where('name', '==', name));
      return afc.valueChanges().pipe( map(products => products as LoginDocument[]));
    }

    findById(id: string): Observable<LoginDocument> {
      const afc: AngularFirestoreDocument<LoginDocument> = this.firestore.collection( this.ROOT_PATH ).doc( id );
      return afc.valueChanges();
    }

    create( newData: LoginDocument ){
      const newId = this.firestore.createId();
      newData.id = newId;
      return this.firestore.collection( this.ROOT_PATH ).doc( newId ).set( Object.assign({}, newData) );
    }

    delete( id: string ){
      return this.firestore.collection( this.ROOT_PATH ).doc(id).delete();
    }

    update( id: string, data: LoginDocument ){
      return this.firestore.collection(this.ROOT_PATH).doc( id ).update( Object.assign({}, data) );
    }
}
