import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule, AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { By } from '@angular/platform-browser';
import { of, Observable, Subject } from 'rxjs';

import { ProductImgListComponent } from './product-img-list.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { OverlaySpinnerServiceService } from 'src/app/services/ui/overlay-spinner/overlay-spinner-service.service';
import {SubHeaderComponent} from '../../components/sub-header/sub-header.component';
import { OverlaySpinnerComponent } from 'src/app/components/overlay-spinner/overlay-spinner.component';
import { NotifyErrorBoxComponent } from '../../components/notify-error-box/notify-error-box.component';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { ProductImgListTemplateComponent } from 'src/app/components/product-img-list-template/product-img-list-template.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UploadData } from 'src/app/models';
import { connect } from 'net';
import { FirebaseStorage } from '@angular/fire';


describe('ProductImgListComponent', () => {
  let component: ProductImgListComponent;
  let fixture: ComponentFixture<ProductImgListComponent>;
  let localStorageServiceMock: LocalStorageService;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  // @ts-ignore
  const angularFireStorageStub: AngularFireStorage = {
    storage: {
      ref: () => ({
        // @ts-ignore
        child: (path: string) => ({
          listAll: () => Promise.resolve({ items: [] })
        }) 
      })
    },
    // @ts-ignore
    upload: (path: string) => ({
      // 欲しいメソッド随時追加してください。
    })
  };

  beforeEach(async(() => {
    localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getShopDocument', 'shopDocument']);
    // @ts-ignore
    localStorageServiceMock.getShopDocument = () => ({ id: 'shop_000' });
    // @ts-ignore
    localStorageServiceMock.shopDocument = { id: 'shop_000' };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MaterialsModule,
        MatProgressSpinnerModule,
        FormsModule,
      ],
      providers: [
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        {provide: AngularFireStorage, useValue: angularFireStorageStub},
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
      declarations: [ 
        ProductImgListComponent, 
        SubHeaderComponent,
        NotifyErrorBoxComponent, 
        OverlaySpinnerComponent,
        ImageLoaderDirective,
        ProductImgListTemplateComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });
​
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSelectFolderClear() called', () => {
    const mockEvt = { target: { value: 'anyfolder' } };
    const eventMock = mockEvt;
    component.onSelectFolderClear(eventMock);
    expect(eventMock.target.value).toEqual('');
    expect(component.uploading).toBeFalsy();
    expect(component.showConfirmDialog).toBeFalsy();
  });


  it('リフレッシュボタンで画像一覧を更新する', async() => {
    spyOn(component['imgListTemplate'], 'refreshList');
    const debugElement = fixture.debugElement;
    const refreshButton = debugElement.query(By.css('.button_refresh'));
    refreshButton.nativeElement.click();
    fixture.detectChanges();
    expect(component['imgListTemplate'].refreshList).toHaveBeenCalled();
  });

  it('InputをclickでclearFolderが呼ばれる', async() => {
    const mockEvt = { target: { value: 'anyfolder' } };
    const eventMock = mockEvt;

    spyOn(component, 'onSelectFolderClear');
    const debugElement = fixture.debugElement;
    const input = debugElement.query(By.css('#fileInput'));
    input.nativeElement.click(eventMock);

    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(component.onSelectFolderClear).toHaveBeenCalledWith(eventMock);
      expect(component.uploading).toBeFalsy();
      expect(component.showConfirmDialog).toBeFalsy();
    })
  });


  it('フォルダが選択される', () => {
    const mockEvt = { target: { value: 'anyfolder' } };
    const eventMock = mockEvt;
    spyOn(component, 'openConfirmDialog');

    component.onSelectFolder(eventMock);
    fixture.detectChanges();
    expect(component.openConfirmDialog).toHaveBeenCalled();

  });

  it('openConfirmDialog() 正常系', async() => {
    const mockFile = new File(['webkitRelativePath'], 'filename.jpg', { type: 'image/jpeg' });
    const mockEvt = { target: { files: [mockFile] } };

    const readAsDataURLMock = jasmine.createSpy('readAsDataURL').and.returnValue(Promise.resolve('Success'));
    component.readAsDataURL = readAsDataURLMock;

    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    component.setUI = false;
    await component.openConfirmDialog(mockEvt);
    fixture.detectChanges();
    expect(component.showConfirmDialog).toBeTruthy();
    expect(component.setUI).toBeTruthy();
    expect(component.selectedFolder).not.toBe('');

  });


  it('openConfirmDialog() 正常系', async() => {
    const mockFile = new File(['webkitRelativePath'], 'filename.jpg', { type: 'image/jpeg' });
    const mockEvt = { target: { files: [mockFile] } };

    const readAsDataURLMock = jasmine.createSpy('readAsDataURL').and.returnValue(Promise.resolve('Success'));
    component.readAsDataURL = readAsDataURLMock;

    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    component.setUI = true;
    await component.openConfirmDialog(mockEvt);
    fixture.detectChanges();
    expect(component.showConfirmDialog).toBeTruthy();
    expect(component.setUI).toBeTruthy();
    expect(component.selectedFolder).not.toBe('');

  });


  it('openConfirmDialog() フォルダにファイルがない', async() => {
    const mockEvt = { target: { files: [] } };
    const readAsDataURLMock = jasmine.createSpy('readAsDataURL').and.returnValue(Promise.resolve('Success'));
    component.readAsDataURL = readAsDataURLMock;

    const uploadDatasStub = [];
    component.upLoadDatas = uploadDatasStub;

    await component.openConfirmDialog(mockEvt);
    fixture.detectChanges();
    expect(component.errorMsg).toEqual('指定フォルダに画像ファイルがないようです');
    expect(component.showConfirmDialog).toBeFalsy();
    readAsDataURLMock.calls.reset();

  });

  it('onUpload() 正常系', ( done: DoneFn ) => {

    spyOn(component['imgListTemplate'], 'refreshList');

    const mockFile = new File(['webkitRelativePath'], 'filename.jpg', { type: 'image/jpeg' });
    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    const uploadFilesMock = jasmine.createSpy('uploadFiles').and.returnValue(Promise.resolve());
    component.uploadFiles = uploadFilesMock;

    fixture.detectChanges();
    component.onUpload().then(()=>{

      expect(component.uploading).toBeFalsy();
      expect(component['imgListTemplate'].refreshList).toHaveBeenCalled();
      expect(component.showConfirmDialog).toBeFalsy();

      uploadFilesMock.calls.reset();

      done();

    })
  });

  it('onUpload() エラーが起きた', async( done: DoneFn ) => {

    spyOn(component['imgListTemplate'], 'refreshList');

    const mockFile = new File(['webkitRelativePath'], 'filename.jpg', { type: 'image/jpeg' });
    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    const uploadFilesMock = jasmine.createSpy('uploadFiles').and.returnValue(Promise.reject());
    component.uploadFiles = uploadFilesMock;
    fixture.detectChanges();
    component.onUpload().then(()=>{
      expect(component.uploading).toBeFalsy();
      expect(component['imgListTemplate'].refreshList).not.toHaveBeenCalled();
      expect(component.showConfirmDialog).toBeFalsy();
      uploadFilesMock.calls.reset();
      done();
    })
  });



  it('ローカルURL取得', ( done: DoneFn ) => {
    const mockFile = new File([''], 'filename.jpg', { type: 'image/jpeg' });
    component.readAsDataURL(mockFile).then((result)=>{
      expect(result).not.toBe('');
      done();
    });
  });


  it('uploadFiles() success', ( done: DoneFn ) => {

    const DoUploadMock = jasmine.createSpy('DoUpload').and.returnValue(Promise.resolve());
    component.DoUpload = DoUploadMock;

    const storage: AngularFireStorage = TestBed.get(AngularFireStorage);
    const storageMock = jasmine.createSpy('upload').and.returnValue(Promise.resolve());
    storage.upload = storageMock;

    const mockFile = new File([''], 'filename.jpg', { type: 'image/jpeg' });
    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    component.uploadFiles().then(()=>{
      expect();
      DoUploadMock.calls.reset();
      storageMock.calls.reset();
      done();
    })
  });

  it('uploadFiles() error', ( done: DoneFn ) => {

    const DoUploadMock = jasmine.createSpy('DoUpload').and.returnValue(Promise.reject('error'));
    component.DoUpload = DoUploadMock;

    const storage: AngularFireStorage = TestBed.get(AngularFireStorage);
    const storageMock = jasmine.createSpy('upload').and.returnValue(Promise.resolve());
    storage.upload = storageMock;

    const mockFile = new File([''], 'filename.jpg', { type: 'image/jpeg' });
    let dataStub = new UploadData();
    dataStub.file = mockFile;
    const uploadDatasStub = [dataStub];
    component.upLoadDatas = uploadDatasStub;

    component.uploadFiles().then(()=>{
      done.fail();
    })
    .catch(err=>{
      expect(err).toBe('error');
      done();
    })

  });


  it('キャンセルボタン処理', () => {
    component.onCancel();
    expect(component.showConfirmDialog).toBeFalsy();
  });

});
