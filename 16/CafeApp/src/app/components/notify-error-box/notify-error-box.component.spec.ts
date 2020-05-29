import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyErrorBoxComponent } from './notify-error-box.component';

describe('NotifyErrorBoxComponent', () => {
  let component: NotifyErrorBoxComponent;
  let fixture: ComponentFixture<NotifyErrorBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyErrorBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyErrorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
