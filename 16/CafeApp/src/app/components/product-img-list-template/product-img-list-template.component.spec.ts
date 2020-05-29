import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';

import { ProductImgListTemplateComponent } from './product-img-list-template.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {ShopDocument} from 'src/app/models';

describe('ProductImgListTemplateComponent', () => {
  let component: ProductImgListTemplateComponent;
  let fixture: ComponentFixture<ProductImgListTemplateComponent>;
  let localStorageServiceMock: any;

  const shopSample: ShopDocument = {
    id: 'shop_000',
    createdAt: '',
    updatedAt: '',
    closedDate: '',
    closedTime: '',
    openDate: '',
    openTime: '',
    isOpened: false,
    mails: [],
    loginMail: '',
    name: '',
    phone: '',
    imagePath: '',
    brandName: '',
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
    }
  };

  beforeEach(async(() => {
    localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['shopDocument']);
    localStorageServiceMock.shopDocument = shopSample;

    TestBed.configureTestingModule({
      imports: [
        AngularFireStorageModule,
        MaterialsModule,
        MatProgressSpinnerModule,
      ],

      providers: [
        {provide: AngularFireStorage, useValue: angularFireStorageStub },
        {provide: LocalStorageService, useValue: localStorageServiceMock},
      ],
      declarations: [ 
        ProductImgListTemplateComponent,
        ImageLoaderDirective,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImgListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshList()', () => {
    component.refreshList();
    
    expect(component.loading).toBeTruthy();
    
  });

});
