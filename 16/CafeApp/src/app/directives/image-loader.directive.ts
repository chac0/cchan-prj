import { Directive, Input, HostBinding, HostListener, DoCheck, ElementRef } from '@angular/core';

enum LoadStatus {
  LOADING,
  LOADED,
  END
}

@Directive({
  selector: '[withImageLoader]'
})
export class ImageLoaderDirective implements DoCheck {
  private _status = LoadStatus.LOADING
  private _loadingImgSrc = '../../assets/gray_loader.svg'
  private _errorImgSrc = '../../assets/no_image/no_image_x2.png'

  @Input() bindSrc: string
  @Input() errorImgSrc = this._errorImgSrc
  @HostBinding('src') src = this._loadingImgSrc
  @HostListener('load') onImageLoaded() {
    this._status = LoadStatus.LOADED
  }
  @HostListener('error') onImageNotLoaded() {
    const element: HTMLImageElement = this.elementRef.nativeElement
    element.src = this.errorImgSrc
    this._status = LoadStatus.END
  }

  constructor(private elementRef: ElementRef) { }

  ngDoCheck() {
    if (this._status === LoadStatus.LOADED && this.bindSrc !== null && this.bindSrc !== '') {
      this.src = this.bindSrc
      this._status = LoadStatus.END
    }
  }
}
