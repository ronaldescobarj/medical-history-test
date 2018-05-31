import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  constructor() { }

  @Input() type: any;
  @ViewChild('deleteModal') deleteModal: BsModalComponent;
  @Output() deleting: EventEmitter<any> = new EventEmitter<any>();
  @Output() canceling: EventEmitter<any> = new EventEmitter<any>();  
  ngOnInit() {
  }

  open() {
    this.deleteModal.open();
  }

  close() {
    this.deleteModal.close();
  }

  deleteRegister() {
    this.deleting.emit();
  }  
}
