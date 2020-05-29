import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlaySpinnerComponent } from '../../../components/overlay-spinner/overlay-spinner.component';

@Injectable({
  providedIn: 'root'
})
export class OverlaySpinnerServiceService {

  private overlayRef: OverlayRef = null;
  private comp: ComponentPortal<OverlaySpinnerComponent>;

  constructor(private overlay: Overlay) {}

  public show() {

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
      const spinnerOverlayPortal = new ComponentPortal(OverlaySpinnerComponent);
      const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
    }


  }

  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }  
}
