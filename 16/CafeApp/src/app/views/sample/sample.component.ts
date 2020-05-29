import { Component, OnInit } from '@angular/core';
import { SampleDocRepository } from '../../repositories';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { SampleDocument } from '../../models';
import { Iso8601 } from '../../utils/iso8601';
import * as moment from 'moment';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {

  form: FormGroup;

  dataList: SampleDocument[];
  // DataStore用のカラム
  displayedColumns: string[] = ['name', 'price', 'birthDay'];

  //form bind用の変数
  kashi_name: string;
  kashi_price: number;
  kashi_birthDay: string;

  constructor( private sampleDocRepository: SampleDocRepository
              ,private formBuilder: FormBuilder ) {

    this.setUpForm();

  }

  ngOnInit() {
    //--------------------------
    // firestoreからlist取得
    //--------------------------
    this.sampleDocRepository.list().subscribe( d => {this.dataList=d; } );

  }

  //========================
  // フォームValidation
  //========================
  setUpForm() {
    this.form = this.formBuilder.group({
      kashi_name: ['', [Validators.required]],
      kashi_price: [0, [Validators.required]],
      kashi_birthDay: ['', Validators.required]
    });
  }

  //========================
  // フォーム投稿
  //========================
  onSubmit( e: Event ) {

    //フォームチェック
    if (!this.form.valid) {
      return;
    }

    //-----------------------------
    // firestoreへ新規データ入れる
    //-----------------------------
    // 新規データ形成
    const newData:SampleDocument  = new SampleDocument();
    newData.name = this.kashi_name;
    newData.price = this.kashi_price;
    newData.birthDay = moment(this.kashi_birthDay).format('YYYY-MM-DD');
    newData.createdAt = Iso8601.now();

    //新規追加処理
    this.sampleDocRepository.create( newData  )
    .then(function( ){
      console.log('作成成功');

    })
    .catch(function( error ){
      console.error(error);
    });

  }

  //========================
  // firestore任意データを削除
  //========================
  onDelete( id: string ) {
    console.log(id)
    this.sampleDocRepository.delete(id)
    .then(function(){
      console.log('削除成功');
    })
    .catch(function(error){
      console.log(error);
    });
  }

}
