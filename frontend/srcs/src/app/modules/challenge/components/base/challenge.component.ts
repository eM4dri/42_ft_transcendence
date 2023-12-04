import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnInit{
  private modalService = inject(NgbModal);
  private challengeService = inject(ChallengeService);
  private authService = inject(AuthService);
  closeResult = '';

  ngOnInit(): void {
    this.challengeService.hereComesANewChallenger(this.authService.getMyUserId()).subscribe(newChallengerUserId => {
      this.openModal(newChallengerUserId);
    });
  }

  openModal(newChallengerUserId: string) {
    const modalRef = this.modalService.open(ChallengeInfoComponent);
    modalRef.componentInstance.newChallengerUserId = newChallengerUserId;
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


