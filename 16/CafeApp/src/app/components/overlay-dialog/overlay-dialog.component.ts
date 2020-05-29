import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  button1Name: string;
  button2Name?: string;
}

@Component({
  selector: 'app-overlay-dialog',
  templateUrl: './overlay-dialog.component.html',
  styleUrls: ['./overlay-dialog.component.scss']
})
export class OverlayDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OverlayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

  onButton1Click( ) {
    this.dialogRef.close(this.data.button1Name);
  }
  onButton2Click( ) {
    this.dialogRef.close(this.data.button2Name);
  }
  
}
