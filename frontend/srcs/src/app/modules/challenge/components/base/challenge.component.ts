import { Component, TemplateRef, inject } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent{
  private modalService = inject(NgbModal);
  closeResult = '';


  openModal() {
    const modalRef = this.modalService.open(ChallengeInfoComponent);
    // Optional: Pass data to the modal component if needed
    // modalRef.componentInstance.someData = someValue;
  
    // Optional: Handle modal result
    modalRef.result.then(
      (result) => {
        console.log(`Modal closed with result: ${result}`);
      },
      (reason) => {
        console.log(`Modal dismissed with reason: ${reason}`);
      }
    );
  }
  
  
  
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  
  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}


