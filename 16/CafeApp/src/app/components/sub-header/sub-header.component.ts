import {Component, Inject, OnInit} from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {LogoutConfirmDialogComponent} from "../logout-confirm-dialog/logout-confirm-dialog.component";
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

  previousUrl: string;

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private router: Router,
    ) {
  }

  ngOnInit() {
    
  }

  showSignoutConfirmDialog() {
    const dialog = this.dialog.open(LogoutConfirmDialogComponent, {
      height: '200px',
      width: '300px',
      disableClose: false
    });

    // ボタンの結果を取得
    dialog.afterClosed().subscribe(result => this.signOutIfOk(result));
  }

  signOutIfOk(result: any) {
    // OKがクリックされたら
    if (result === 'OK') {
      this.authService.SignOut();
    }
  }
}
