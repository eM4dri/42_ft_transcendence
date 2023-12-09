import { Component, OnInit, inject } from '@angular/core';
import { AdminService, AuthService } from 'src/app/services';
import { AlertModel } from 'src/app/models';
import { UriConstants } from 'src/app/utils';
import { HttpClient } from '@angular/common/http';

export class AdminAlertsConstants {
  public static readonly PROMOTED = 'You have been promoted';
  public static readonly DEMOTED = 'You have been demoted';
  public static readonly BANNED = 'You have been banned';
}

@Component({
  selector: 'app-admin-alerts',
  templateUrl: './admin-alerts.component.html',
  styleUrl: './admin-alerts.component.scss'
})
export class AdminAlertsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  alertConfig = new AlertModel.AlertaClass(
    false,
    'Info',
    AlertModel.AlertSeverity.INFO
  );

  ngOnInit(): void {
    
    this.adminService.userBanned().subscribe(userId => {
      this.authService.logOut();

    });
    this.adminService.userPromoted().subscribe(userId => {
      this.refreshToken(AdminAlertsConstants.PROMOTED);
    });
    this.adminService.userDemoted().subscribe(userId => {
      this.refreshToken(AdminAlertsConstants.DEMOTED);
    });
  }

  public openAlert(msg: string) {
    this.alertConfig.singleMessage = msg;
    this.alertConfig.open = true;
  }

  public closeAlert() {
    this.alertConfig.open = false;
  }

  logout() {
    this.authService.logOut();
    this.http.get<string>(UriConstants.AUTH_PING).subscribe({
      complete: () => {
        this.openAlert(AdminAlertsConstants.BANNED);
      }
    });
  }

  refreshToken(displayMsg: string) {
    this.authService.refreshTokens()
		this.http.get<string>(UriConstants.AUTH_PING).subscribe({
      complete: () => {
        this.openAlert(displayMsg);
      }
    });
	}
}
