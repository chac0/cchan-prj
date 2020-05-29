import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductInfoDocument} from '../../models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProductInfoDocRepository} from '../../repositories';

@Component({
  selector: 'app-product-list-update',
  templateUrl: './product-list-update.component.html',
  styleUrls: ['./product-list-update.component.scss']
})
export class ProductListUpdateComponent implements OnInit, OnChanges {

  @Input() i: number;
  @Input() item: ProductInfoDocument;
  @Input() isOrderConfirmed: boolean;
  updateForm: FormGroup;
  id: string;

  constructor(private productInfoDocRepository: ProductInfoDocRepository,
              private formBuilder: FormBuilder,
              private firestore: AngularFirestore) {
    this.setUpForm();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setUpForm();
  }

  setUpForm() {
    this.updateForm = this.formBuilder.group({
      item_stock: [0, [Validators.required]],
    });
  }

  update(number_stock: number, id: string) {
    //新規追加処理
    this.productInfoDocRepository.findById(id).subscribe(data => {
      data.stock = number_stock;
      this.firestore.collection( "products" ).doc( id ).set( Object.assign({}, data) );
    });
  }

  updateHandler(id: string, i: string) {
    this.id = id;
    console.log('tt',id,'tt',i);

    //フォームチェック
    if (!this.updateForm.valid) {
      return;
    }

    const element: HTMLInputElement =<HTMLInputElement>document.getElementById('item_stock-'+i);
    const value: string = element.value;

    this.update(Number(value),id);
  }
}
