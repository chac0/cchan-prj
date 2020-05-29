import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-logout-confirm-dialog',
  templateUrl: './logout-confirm-dialog.component.html',
  styleUrls: ['./logout-confirm-dialog.component.scss']
})
export class LogoutConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<LogoutConfirmDialogComponent>) { }

  onClickOkButton(): void {
    // OKボタンが押されたときは「OK」を呼び出し元に渡す。
    this.matDialogRef.close('OK');
  }

}
