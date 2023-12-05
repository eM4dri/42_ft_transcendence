import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

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
  modalReference: NgbModalRef[] = [];

  ngOnInit(): void {
    this.challengeService.hereComesANewChallenger(this.authService.getMyUserId()).subscribe(newChallengerUserId => {
      this.openModal(newChallengerUserId);
    });
  
  }

  constructor(private readonly router: Router)
  {

    this.challengeService.startChallenge_front().subscribe(ctrl => {
      if (ctrl) {
        for (const modal of this.modalReference){
          modal.close();
        }
        this.modalReference = [];
        router.navigate(["/game"]);
      }
    });
  }

  openModal(newChallengerUserId: string) {
    this.modalReference.push(this.modalService.open(ChallengeInfoComponent));
    this.modalReference[0].componentInstance.newChallengerUserId = newChallengerUserId;
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


