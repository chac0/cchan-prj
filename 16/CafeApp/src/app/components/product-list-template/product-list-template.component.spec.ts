import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material';

import { ProductListTemplateComponent } from './product-list-template.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ShopDocument } from 'src/app/models';

describe('ProductListTemplateComponent', () => {
  let component: ProductListTemplateComponent;
  let fixture: ComponentFixture<ProductListTemplateComponent>;


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

  const localStorageServiceStub: LocalStorageService = jasmine.createSpyObj('localStorageService', ['getShopDocument', 'shopDocument'])
  localStorageServiceStub.getShopDocument = () => shopSample
  localStorageServiceStub.shopDocument = shopSample

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialsModule,
        MatProgressSpinnerModule,
      ],

      providers: [
        {provide: LocalStorageService, useValue: localStorageServiceStub},
      ],

      declarations: [ 
        ProductListTemplateComponent,
        ImageLoaderDirective,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
