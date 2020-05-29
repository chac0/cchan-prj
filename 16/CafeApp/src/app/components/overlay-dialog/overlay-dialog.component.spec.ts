import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayDialogComponent, DialogData } from './overlay-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('OverlayDialogComponent', () => {
  let component: OverlayDialogComponent;
  let fixture: ComponentFixture<OverlayDialogComponent>;

  const mockClose = jasmine.createSpy('close').and.returnValue(undefined)
  // @ts-ignore
  const matDialogRefStub: MatDialogRef<any, any> = { close: mockClose, afterClosed: () =>  of('') }
  matDialogRefStub.close = mockClose
  const dialogData = {
    title: 'テスト',
    message: '<div>Test</div>',
    button1Name: 'はい',
    button2Name: 'キャンセル'
  } as DialogData

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub  },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        OverlayDialogComponent,
      ],
      imports: [
        FormsModule,
        MaterialsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockClose.calls.reset();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button1を押した場合、button1Nameが戻り値としてセットされている', () => {
    fixture.debugElement.query(By.css('#button1')).nativeElement.click()
    fixture.detectChanges()
    expect(matDialogRefStub.close).toHaveBeenCalledWith('はい')
  })

  it('button2を押した場合、button2Nameが戻り値としてセットされている', () => {
    fixture.debugElement.query(By.css('#button2')).nativeElement.click()
    fixture.detectChanges()
    expect(matDialogRefStub.close).toHaveBeenCalledWith('キャンセル')
  })
});
