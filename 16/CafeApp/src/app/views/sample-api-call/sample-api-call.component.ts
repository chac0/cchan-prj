import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-sample-api-call',
  templateUrl: './sample-api-call.component.html',
  styleUrls: ['./sample-api-call.component.scss']
})
export class SampleApiCallComponent implements OnInit {

  constructor( private cloudFunctions: AngularFireFunctions ) { }

  ngOnInit() {
  }

  onCallAPI()
  {
    console.log("firebase cloud function: onCall で作ったapi呼び出すよ");
    this.cloudFunctions.httpsCallable('sampleCall')({ id:'id_0' })
    .pipe()
    .subscribe(( data:any )=>{
      console.log(data);
    });
    // this.cloudFunctions.httpsCallable('sampleCall')({ id:'id_0' }).toPromise().then((value)=>{
    //   console.log('success');
    //   console.log(value);
    // })
    // .catch(e=>{
    //   console.log('error');
    //   console.log(e);
    // })

  }  

}
