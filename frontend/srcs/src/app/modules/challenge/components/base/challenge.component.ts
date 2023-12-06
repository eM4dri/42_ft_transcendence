import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeInfoComponent } from '../challenge-info/challenge-info.component';
import { ChallengeService } from 'src/app/services/challenge.service';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { ChallengingComponent } from '../challenging/challenging.component';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnInit{
  private modalService = inject(NgbModal);
  private challengeService = inject(ChallengeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  closeResult = '';
  modalReference: NgbModalRef[] = [];

  ngOnInit(): void {
    this.challengeService.hereComesANewChallenger(this.authService.getMyUserId()).subscribe(newChallengerUserId => {
      this.openModal(newChallengerUserId);
    });
    this.challengeService.getChallengingUserIdSub().subscribe(challengingUserId => {
      this.openModalChallenging(challengingUserId);
    });
    this.challengeService.startChallenge_front().subscribe(ctrl => {
      if (ctrl) {
        for (const modal of this.modalReference){
          modal.close();
        }
        this.modalReference = [];
        this.router.navigate(["/game"]);
      }
    });
    this.challengeService.clearChallenges().subscribe(()=>{
      for (const modal of this.modalReference){
        modal.close();
      }
      this.modalReference = [];
    });
  }

  openModal(newChallengerUserId: string) {
    this.modalReference.push(this.modalService.open(ChallengeInfoComponent,{ backdrop: 'static' }));
    this.modalReference[0].componentInstance.newChallengerUserId = newChallengerUserId;
  }

  openModalChallenging(challengingUserId: string) {
    this.modalReference.push(this.modalService.open(ChallengingComponent, { backdrop: 'static' }));
    this.modalReference[0].componentInstance.challengingUserId = challengingUserId;
  }
    
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  
}


