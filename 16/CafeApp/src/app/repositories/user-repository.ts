import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserDocument } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDocRepository {

  private ROOT_PATH = 'users';

  constructor(private firestore: AngularFirestore) { }

  findAll(): Observable<UserDocument[]> {
    return this.firestore.collection(this.ROOT_PATH)
      .valueChanges()
      .pipe(
        map((it) => it as UserDocument[])
      )
  }
}
