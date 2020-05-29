import { Component, OnInit, Input } from '@angular/core';
import { ProductInfoDocument } from 'src/app/models';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-product-list-template',
  templateUrl: './product-list-template.component.html',
  styleUrls: ['./product-list-template.component.scss']
})
export class ProductListTemplateComponent implements OnInit {

  @Input() productList: ProductInfoDocument[];
  @Input() loading: boolean;
  @Input() tableCsvClassName: string;

  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  //========================
  // firestore任意データを削除
  //========================
  onDelete( id: string ) {
    console.log(id)
    this.firestore.collection( "products" ).doc(id).delete()
      .then(function(){
        console.log('削除成功');
      })
      .catch(function(error){
        console.log(error);
      });
  }
}
