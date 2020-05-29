import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


import { OverlaySpinnerComponent } from './overlay-spinner.component';

describe('OverlaySpinnerComponent', () => {
  let component: OverlaySpinnerComponent;
  let fixture: ComponentFixture<OverlaySpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlaySpinnerComponent ],
      imports: [
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlaySpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
