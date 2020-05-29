import { Component, OnInit, Output, Inject, EventEmitter  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductInfoDocument } from '../../models';


@Component({
  selector: 'app-csv-confirm-dialog',
  templateUrl: './csv-confirm-dialog.component.html',
  styleUrls: ['./csv-confirm-dialog.component.scss']
})
export class CsvConfirmDialogComponent implements OnInit {

  @Output() submitUpload = new EventEmitter();

  csvClassName: string = "product_confirm_list";

  constructor( 
    public dialogRef: MatDialogRef<CsvConfirmDialogComponent>
    ,@Inject(MAT_DIALOG_DATA) public dataList: ProductInfoDocument[]
     ) { }

  ngOnInit() {

  }

  closeModal() {
    this.dialogRef.close();
  }

  onCallUpload()
  {
    this.closeModal();
    this.submitUpload.emit();
  }

}
