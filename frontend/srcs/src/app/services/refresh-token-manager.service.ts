import { HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CookieConstants, UriConstants } from '../utils';

@Injectable({ providedIn: 'root' })
export class RefreshTokenManageService {
	private _isRefreshing = false;
	private cookieService = inject(CookieService);

	get isRefreshing() {
		return this._isRefreshing;
	}
	set isRefreshing(value) {
		this._isRefreshing = value;
	}

	addTokenHeader(request: HttpRequest<unknown>) {
		const user = this.getDataUser();
		const token = request.url === UriConstants.AUTH_REFRESH ? user.refreshToken : user.accessToken;
		return request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
	}

	updateTokens(token: string, refreshToken: string) {
		this.cookieService.set(CookieConstants.USER_TOKEN, token);
		this.cookieService.set(CookieConstants.REFRESH_TOKEN, refreshToken);
	}

	getDataUser() {
		return {
			accessToken: this.cookieService.check(CookieConstants.USER_TOKEN) ? this.cookieService.get(CookieConstants.USER_TOKEN) : ' ',
			refreshToken: this.cookieService.get(CookieConstants.REFRESH_TOKEN),
		};
	}
}
