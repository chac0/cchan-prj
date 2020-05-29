import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { of, Observable, Subject } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


import { AuthService } from '../../services/auth.service';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ProductEditComponent } from './product-edit.component';
import { ProductCsvExportComponent } from '../product-csv-export/product-csv-export.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';
import { ProductListTemplateComponent } from 'src/app/components/product-list-template/product-list-template.component';
import { NotifyErrorBoxComponent } from '../../components/notify-error-box/notify-error-box.component';
import { OverlaySpinnerServiceService } from 'src/app/services/ui/overlay-spinner/overlay-spinner-service.service';
import { OverlaySpinnerComponent } from 'src/app/components/overlay-spinner/overlay-spinner.component';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { ProductInfoDocRepository } from '../../repositories';
import { ShopDocRepository } from '../../repositories';
import { ProductInfoDocument, ShopDocument } from 'src/app/models';
import { CSVLoader } from '../../mappers/product-csv';
import { FileIO } from '../../utils/FileIO';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RegisterComponent } from '../register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';


describe('ProductEditComponent', () => {

  let injector: TestBed;
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let localStorageServiceMock: LocalStorageService;
  let shopDocRepositoryMock: ShopDocRepository;
  let shopDocSubject: Subject<ShopDocument[]>;
  let authService: AuthService;

  let productDocSubject: Subject<ProductInfoDocument[]>;
  let productRepositoryMock: ProductInfoDocRepository;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };
  authStub.authState = of(null);
  // @ts-ignore
  const shops: ShopDocument[] = [{
    id: 'shop_000'
  }];

  const products: ProductInfoDocument[] = [
    // @ts-ignore
    { id: 'p_0', name: '商品0', imagePath: 'path0', shopId: 'shop_000' },
    // @ts-ignore
    { id: 'p_1', name: '商品1', imagePath: '', shopId: 'shop_000' },
  ];

  beforeEach(async(() => {

    localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getShopDocument']);
    // @ts-ignore
    localStorageServiceMock.getShopDocument = () => ({ id: 'shop_000' });
    shopDocSubject = new Subject<ShopDocument[]>();
    shopDocRepositoryMock = jasmine.createSpyObj('shopDocRepository', ['findByLoginMail']);
    shopDocRepositoryMock.findByLoginMail = (loginMail: string) => of(shops);

    productDocSubject = new Subject();
    productRepositoryMock = jasmine.createSpyObj('productRepository', ['getList']);
    productRepositoryMock.getList = (shopId: string) => of(products);

    authService = jasmine.createSpyObj('authService', ['userData']);
    // @ts-ignore
    authService.userData = of({ email: 'test@example.com' });

    const angularFireStorageStub: AngularFireStorage = {
      storage: {
        // @ts-ignore
        ref: (path?: string) => ({
          getDownloadURL: () => Promise.resolve(`storage/${path}`)
        })
      },
      // @ts-ignore
      upload: (path: string) => ({
        // 欲しいメソッド随時追加してください。
      })
    };

    authStub.authState = of(null);
    injector = getTestBed();
  
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MaterialsModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AngularFireFunctions },
        { provide: AngularFirestore },
        { provide: AngularFireStorage, useValue: angularFireStorageStub },
        { provide: AngularFireAuth, useValue: authStub },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: ProductInfoDocRepository, useValue: productRepositoryMock },
        { provide: ShopDocRepository, useValue: shopDocRepositoryMock },
        { provide: AuthService, useValue: authService }
      ],
      declarations: [ 
        ProductEditComponent, 
        ProductCsvExportComponent, 
        ProductListTemplateComponent,
        SubHeaderComponent,
        NotifyErrorBoxComponent, 
        OverlaySpinnerComponent,
        ImageLoaderDirective, 
        RegisterComponent
      ],

    })
    .compileComponents();
  }));
  authStub.authState = of(null);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Fileを選択ボタンを押して、何もせずに閉じた場合、ファイルロードされない', () => {
    const fileToTextMock = jasmine.createSpy('fileToText').and.returnValue(Promise.resolve('test'));
    component.fileToText = fileToTextMock;

    component.onFileSelected({ target: { value: 'fileName', files: [] } });
    fixture.detectChanges();

    expect(fileToTextMock).not.toHaveBeenCalled();
    fileToTextMock.calls.reset();
  });

  it('Fileを選択ボタンを押して、csv以外のボタンを追加した場合、ファイルロードされない', () => {
    const fileToTextMock = jasmine.createSpy('fileToText').and.returnValue(Promise.resolve('test'));
    component.fileToText = fileToTextMock;

    component.onFileSelected({ target: { value: 'fileName', files: [{ name: 'test.txt', type: 'txt' }] } });
    fixture.detectChanges();

    expect(fileToTextMock).not.toHaveBeenCalled();
    expect(component.errorMsg).toEqual('ファイルがcsvではありません');
    fileToTextMock.calls.reset();
  });

  it('Fileを選択ボタンを押して、csvボタンを追加した場合、正常にファイルを読み込める', async () => {
    const fileToTextMock = jasmine.createSpy('fileToText').and.returnValue(Promise.resolve('test'));
    const loadCSVTableMock = jasmine.createSpy('loadCSVTable').and.returnValue(undefined);
    const openCSVConfirmDialogMock = jasmine.createSpy('openCSVConfirmDialog').and.returnValue(undefined);
    component.fileToText = fileToTextMock;
    component.loadCSVTable = loadCSVTableMock;
    component.openCSVConfirmDialog = openCSVConfirmDialogMock;

    await component.onFileSelected({ target: { value: 'fileName', files: [{ name: 'test.csv', type: 'csv' }] } });
    fixture.detectChanges();

    expect(fileToTextMock).toHaveBeenCalled();
    expect(loadCSVTableMock).toHaveBeenCalled();
    expect(openCSVConfirmDialogMock).toHaveBeenCalled();
    fileToTextMock.calls.reset();
    loadCSVTableMock.calls.reset();
    openCSVConfirmDialogMock.calls.reset();
  });

  it('Fileを選択ボタンを押して、csvボタンを追加し、ファイル読み込み中にエラー', async () => {
    const fileToTextMock = jasmine.createSpy('fileToText').and.returnValue(Promise.reject('file read error'));
    component.fileToText = fileToTextMock;
    
    await component.onFileSelected({ target: { value: 'fileName', files: [{ name: 'test.csv', type: 'csv' }] } });
    fixture.detectChanges();

    expect(fileToTextMock).toHaveBeenCalled();
    expect(component.errorMsg).toEqual('file read error');
    fileToTextMock.calls.reset();
  });

  it('Fileを選択ボタンを押して、csvボタンを追加し、フォーマットしている際にエラー', async () => {
    const fileToTextMock = jasmine.createSpy('fileToText').and.returnValue(Promise.resolve('test'));
    const loadCSVTableMock = () => {
      throw new Error('loadCSVTable error');
    };
    component.fileToText = fileToTextMock;
    component.loadCSVTable = loadCSVTableMock;

    await component.onFileSelected({ target: { value: 'fileName', files: [{ name: 'test.csv', type: 'csv' }] } });
    fixture.detectChanges();

    expect(fileToTextMock).toHaveBeenCalled();
    expect(component.errorMsg).toEqual('ファイルの内容が正しいCSVか確認してください');

    fileToTextMock.calls.reset();
  })
});
