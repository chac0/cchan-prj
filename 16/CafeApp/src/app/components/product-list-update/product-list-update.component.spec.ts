import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListUpdateComponent } from './product-list-update.component';

describe('ProductListUpdateComponent', () => {
  let component: ProductListUpdateComponent;
  let fixture: ComponentFixture<ProductListUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
