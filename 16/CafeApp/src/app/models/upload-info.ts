import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
// import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export class UploadData{
    file: File;
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: string;
    localURL: string | ArrayBuffer;
  
  }
  