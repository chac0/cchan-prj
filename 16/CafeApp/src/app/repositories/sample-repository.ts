import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SampleDocument } from '../models';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SampleDocRepository {


    private ROOT_PATH:string = 'Sample Document';

    constructor(private firestore: AngularFirestore) { }

    findAll(): Observable<SampleDocument[]> {
        return this.firestore.collection( this.ROOT_PATH ).valueChanges()
                  .pipe(map(products => products as SampleDocument[]));
      }

    list(): Observable<SampleDocument[]> {
      const afc: AngularFirestoreCollection<SampleDocument> = this.firestore.collection( this.ROOT_PATH , ref => ref.orderBy('price'));
      return afc.valueChanges().pipe( map(products => products as SampleDocument[]));
    }

    findByName(name: string): Observable<SampleDocument[]> {
      const afc: AngularFirestoreCollection<SampleDocument> = this.firestore.collection( this.ROOT_PATH, ref => ref.where('name', '==', name));
      return afc.valueChanges().pipe( map(products => products as SampleDocument[]));
    }

    findById(id: string): Observable<SampleDocument> {
      const afc: AngularFirestoreDocument<SampleDocument> = this.firestore.collection( this.ROOT_PATH ).doc( id );
      return afc.valueChanges();
    }

    create( newData: SampleDocument ){
      const newId = this.firestore.createId();
      newData.id = newId;
      return this.firestore.collection( this.ROOT_PATH ).doc( newId ).set( Object.assign({}, newData) );
    }

    delete( id: string ){
      return this.firestore.collection( this.ROOT_PATH ).doc(id).delete();
    }

    update( id: string, data: SampleDocument ){
      return this.firestore.collection(this.ROOT_PATH).doc( id ).update( Object.assign({}, data) );
    }
  
}
