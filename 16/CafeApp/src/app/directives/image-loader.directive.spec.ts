import { ImageLoaderDirective } from './image-loader.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
@Component({
  template: `<img withImageLoader [bindSrc]="path">`
})
class MockComponent {
  path = '../../assets/icon.jpg'
  constructor() {  }
}
describe('ImageLoaderDirective', () => {
  let mockComponent: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let debugElement: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImageLoaderDirective,
        MockComponent
      ]
    });
    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.css('img'))
  })

  it('displayed loading image', () => {
    fixture.detectChanges();
    expect(debugElement.nativeElement.src).toContain('gray_loader.svg');
  });

  it('bindSrcから追加されたImageを表示できる', () => {
    debugElement.triggerEventHandler('load', null);
    fixture.detectChanges();
    expect(debugElement.nativeElement.src).toContain('icon.jpg');
  });

  it('Error時にError用のImageを追加できる', () => {
    mockComponent.path = 'error.png';
    debugElement.triggerEventHandler('load', null);
    fixture.detectChanges();
    debugElement.triggerEventHandler('error', null);
    fixture.detectChanges();
    expect(debugElement.nativeElement.src).toContain('no_image_x2.png');
  })
});
