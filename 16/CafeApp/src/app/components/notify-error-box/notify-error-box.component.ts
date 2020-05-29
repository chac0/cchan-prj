import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notify-error-box',
  templateUrl: './notify-error-box.component.html',
  styleUrls: ['./notify-error-box.component.scss']
})
export class NotifyErrorBoxComponent implements OnInit {

  @Input() errorMsg: string;

  constructor() { }

  ngOnInit() {
  }

}
