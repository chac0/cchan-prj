import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { MaterialsModule } from 'src/app/materials/materials.module';
import { CsvConfirmDialogComponent } from './csv-confirm-dialog.component';
import { ProductListTemplateComponent } from 'src/app/components/product-list-template/product-list-template.component';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { ProductInfoDocument } from 'src/app/models';

describe('CsvConfirmDialogComponent', () => {
  let component: CsvConfirmDialogComponent;
  let fixture: ComponentFixture<CsvConfirmDialogComponent>;


  const product: ProductInfoDocument = new ProductInfoDocument();
  const productList : ProductInfoDocument[] = [
    product
  ]


  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [
        MaterialsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: productList },
      ],

      declarations: [ 
        CsvConfirmDialogComponent, 
        ProductListTemplateComponent, 
        ImageLoaderDirective,

      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
/*
  it('closeModal()でダイアログが閉じる', () => {
    component.closeModal();
    // expect(component.dialogRef).toHaveBeenCalled();
  });

  it('アップロードボタンでemitが呼ばれる', () => {
    const spyUpload = spyOn(component.submitUpload, 'emit');
    component.onCallUpload();

    fixture.detectChanges();
    // expect(component.closeModal).toHaveBeenCalled();
    expect(spyUpload).toHaveBeenCalled();
    spyUpload.calls.reset();
  });
  */

});
