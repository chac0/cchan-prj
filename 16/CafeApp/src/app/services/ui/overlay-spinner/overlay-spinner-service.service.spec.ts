import { TestBed } from '@angular/core/testing';
​
import { MatProgressSpinnerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
​
​
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
​
import { OverlaySpinnerServiceService } from './overlay-spinner-service.service';
import { OverlaySpinnerComponent } from '../../../components/overlay-spinner/overlay-spinner.component';
import { NgModule } from '@angular/core';
​
​
@NgModule({
  entryComponents: [
    OverlaySpinnerComponent
  ]
})
class TestModule {}
​
describe('OverlaySpinnerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverlaySpinnerComponent],
      imports: [
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        TestModule
      ],
      providers:[Overlay]
  
    });
  });
​
  it('should be created', () => {
    const service: OverlaySpinnerServiceService = TestBed.get(OverlaySpinnerServiceService);
    expect(service).toBeTruthy();
    service.show();
    service['overlayRef'] = null;
    service.hide();
  });
​
  it('２回 showをcallしても１回しかSpinnerを開かない', () => {
    const service: OverlaySpinnerServiceService = TestBed.get(OverlaySpinnerServiceService);
    const overLay: Overlay = TestBed.get(Overlay);
    const spyOnCreate = spyOn(overLay, 'create').and.returnValue({ attach: (portal: any) => ({}) as any } as OverlayRef);
    service.show();
    service.show();
    
    expect(spyOnCreate).toHaveBeenCalledTimes(1);
  });
​
  it('Spinnerが開いてないとhideをcallしても何も起きない', () => {
    const service: OverlaySpinnerServiceService = TestBed.get(OverlaySpinnerServiceService);
    const overLay: Overlay = TestBed.get(Overlay);
    const detachMock: () => any = jasmine.createSpy('detach');
    spyOn(overLay, 'create').and.callThrough().and.returnValue({ attach: (portal: any) => ({}) as any, detach: detachMock } as OverlayRef);
    service.show();
    service.hide();
    service.hide();
    
    expect(detachMock).toHaveBeenCalledTimes(1);
  })
});