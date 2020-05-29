import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';

import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth.service';
import {of} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';


describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],

      providers: [
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ],

      declarations: [ SubHeaderComponent ]
    })
      .compileComponents();
  }));
  authStub.authState = of(null);

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('モーダルダイアログが呼び出される', () => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    const openMock = jasmine.createSpy('open')
      .and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<any, any>);
      matDialog.open = openMock;

    component.showSignoutConfirmDialog();
    fixture.detectChanges();

    expect(openMock).toHaveBeenCalled();
    openMock.calls.reset();
  });

  it('DialogでOKを選択するとログアウトできる', () => {
    const fireAuth: AngularFireAuth = TestBed.get(AngularFireAuth);
    const mockSignOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve());
    fireAuth.auth.signOut = mockSignOut;

    component.signOutIfOk('OK');
    fixture.detectChanges();

    expect(mockSignOut).toHaveBeenCalled();
  });
});
