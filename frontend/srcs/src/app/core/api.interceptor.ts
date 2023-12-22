import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { RefreshTokenManageService } from '../services/refresh-token-manager.service';
import { UriConstants } from '../utils';
import { environment } from 'src/environments/environment';

export const ApiInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
	if (request.url === UriConstants.VALID_TFA || 
		request.url === environment.loginUrl) {
		return next(request);
	}

	const refreshTokenManageService = inject(RefreshTokenManageService);

	if (request.url === UriConstants.AUTH_REFRESH ) {
		const requestClone = refreshTokenManageService.addTokenHeader(request);
		return next(requestClone);
	}

	if (refreshTokenManageService.isRefreshing) {
		return EMPTY;
	}

	const dataUser = refreshTokenManageService.getDataUser();

	if (!dataUser || !dataUser.accessToken) {
		inject(Router).navigateByUrl('/');
		return EMPTY;
	}

	const requestClone = refreshTokenManageService.addTokenHeader(request);

	return next(requestClone);
};
