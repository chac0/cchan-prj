import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {of, Subject} from 'rxjs';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { AngularFirestore } from '@angular/fire/firestore';

import { SampleComponent } from './sample.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';
import { SampleDocument } from '../../models';
import { SampleDocRepository } from '../../repositories';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../../services/auth.service';

describe('SampleComponent', () => {
  let component: SampleComponent;
  let fixture: ComponentFixture<SampleComponent>;

  let sampleDocRepositoryMock: any;
  let sampleDocSubject: Subject< SampleDocument[] >;

  let newId: string;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(async(() => {

    sampleDocSubject = new Subject()
    sampleDocRepositoryMock = jasmine.createSpyObj('sampleDocRepository', ['list', 'create', 'delete']);
    sampleDocRepositoryMock.list.and.returnValue(sampleDocSubject);

    TestBed.configureTestingModule({

      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatButtonModule,
        RouterTestingModule.withRoutes([]),

      ],
      providers: [
        { provide: SampleDocRepository, useValue: sampleDocRepositoryMock },
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        AuthService
      ],
      declarations: [ SampleComponent, SubHeaderComponent ]
    })
      .compileComponents();
  }));
  authStub.authState = of(null);

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('インスタンスを生成できる', () => {
    expect(component).toBeTruthy();
  });

  it('菓子名 は必須です', () => {
    const val = component.form.get('kashi_name');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });

  it('価格 は必須です', () => {
    const val = component.form.get('kashi_price');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });

  it('製造年月日 は必須です', () => {
    const val = component.form.get('kashi_birthDay');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });

  it('一覧を取得できる', () => {

    sampleDocSubject.next([]);

    expect(sampleDocRepositoryMock.list).toHaveBeenCalled();
  });


});
