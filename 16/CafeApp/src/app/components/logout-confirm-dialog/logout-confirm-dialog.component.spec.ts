import { Component, NgModule } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogModule, MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';

import { LogoutConfirmDialogComponent } from './logout-confirm-dialog.component';

describe('LogoutConfirmDialogComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  let noop: ComponentFixture<NoopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
      providers: [
        { provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }}
      ]
    });

    dialog = TestBed.get(MatDialog);

    noop = TestBed.createComponent(NoopComponent);

  });

  it('インスタンスを生成できる', () => {
    expect(noop).toBeTruthy();
  });

  it('ログアウトダイアログの表示', () => {
    const config = {
      height: '200px',
      width: '300px',
      disableClose: false
    };
    dialog.open(LogoutConfirmDialogComponent, config);

    // Overlayの変化を待つ
    noop.detectChanges();

    const dialogTitle = overlayContainerElement.querySelector('#mat-dialog-title');
    const cancelButton = overlayContainerElement.querySelector('button');
    const okButton = overlayContainerElement.querySelector('#ok-button');

    expect(dialogTitle.textContent).toBe(' ログアウトします。 よろしいですか？\n');
    expect(cancelButton.textContent).toBe('キャンセル');
    expect(okButton.textContent).toBe('OK');
  });

  it('should call increment', () => {
    const okButton = overlayContainerElement.querySelector('#ok-button');
    const button = noop.debugElement.nativeElement.querySelector('#ok-button');
  });

});

@Component({
  template: ''
})
// Overlayの変化を感知するため
class NoopComponent {}

const TEST_DIRECTIVES = [
  LogoutConfirmDialogComponent,
  NoopComponent
];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    LogoutConfirmDialogComponent
  ],
})
class DialogTestModule { }
