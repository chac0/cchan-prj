import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireFunctions } from '@angular/fire/functions';
import { By } from '@angular/platform-browser';

import { ProductCsvExportComponent } from './product-csv-export.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ProductInfoDocRepository } from '../../repositories';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CSVExporter } from 'src/app/mappers/product-csv';
import { ProductInfoDocument } from 'src/app/models';

describe('ProductCsvExportComponent', () => {
  let component: ProductCsvExportComponent;
  let fixture: ComponentFixture<ProductCsvExportComponent>;
  let localStorageServiceMock: LocalStorageService;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(async(() => {

    localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['shopDocument']);
    // @ts-ignore
    localStorageServiceMock.shopDocument = { id: 'shop_000' };

    TestBed.configureTestingModule({
      imports: [
        MaterialsModule,
      ],

      declarations: [ ProductCsvExportComponent ],
      providers: [
        {provide: AngularFireFunctions},
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        ProductInfoDocRepository,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCsvExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ダウンロードボタンを押されたらonDownloadCSV()呼ばれる', () => {
    spyOn(component, 'onDownloadCSV');
    const debugElement = fixture.debugElement;
    const exportButton = debugElement.query(By.css('.export-button'));
    exportButton.nativeElement.click();
    expect(component.onDownloadCSV).toHaveBeenCalled();
  });


  it('onDownloadCSV()でリスト取れたら_downloadCSV()呼ぶ', async(done:DoneFn) => {
    spyOn(component, '_downloadCSV');

    const fileToTextMock = jasmine.createSpy('_downloadCSV');
    component._downloadCSV = fileToTextMock;

    const repository: ProductInfoDocRepository = TestBed.get(ProductInfoDocRepository);
    const repoMock = jasmine.createSpy('getListOnce').and.returnValue(Promise.resolve());
    repository.getListOnce = repoMock;
    component['localStorageService'] = localStorageServiceMock;
    component.onDownloadCSV();
    fixture.detectChanges();
    expect(component.errorMsg).toEqual('');

    repository.getListOnce(localStorageServiceMock.shopDocument.id).then((list)=>{
      done();
      expect(fileToTextMock).toHaveBeenCalledWith(list);
      repoMock.calls.reset();
    });
    
    
  });

  it('_downloadCSVの中身', () => {
    spyOn(component, 'onClickDownload');
    let produtStub: ProductInfoDocument = new ProductInfoDocument();
    const productListStub = [
      produtStub
    ];
    let parser: CSVExporter = new CSVExporter(productListStub);
    component._downloadCSV(productListStub);
    expect(component.onClickDownload).toHaveBeenCalledWith(parser.csvTableStr);

  });
  
  
  it('csvファイルがダウンロード出来る', () => {
    const spyObj = jasmine.createSpyObj('a', ['click', 'remove', 'setAttribute']);
    spyOn(document, 'createElement').and.returnValue(spyObj);
    const dummyData = { id:'id_0', name:'name_0' };
    component.onClickDownload( dummyData );
    fixture.detectChanges();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(spyObj.download).toEqual('商品情報.csv');
    expect(spyObj.click).toHaveBeenCalled();
    expect(spyObj.remove).toHaveBeenCalled();

  });  


});
