import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, concatMap, finalize, throwError } from 'rxjs';
import { RefreshTokenManageService } from '../services/refresh-token-manager.service';
import { ApiService } from '../services';
import { UriConstants } from '../utils';
import { environment } from 'src/environments/environment';

export const ErrorApiInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
	const appService = inject(ApiService);
	const refreshTokenManageService = inject(RefreshTokenManageService);
	const router = inject(Router);
	if (request.url === UriConstants.VALID_TFA || 
		request.url === environment.loginUrl) {
		return next(request);
	}

	return next(request).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status == HttpStatusCode.Unauthorized) {
				console.log('****INICIANDO REFRESH TOKEN****');
				refreshTokenManageService.isRefreshing = true;

				return appService.refreshToken().pipe(
					finalize(() => (refreshTokenManageService.isRefreshing = false)),
					concatMap((response) => {
						console.log(response);
						refreshTokenManageService.updateTokens(response.accessToken, response.refreshToken);

						console.log('****TOKEN ACTUALIZADO****');

						const requestClone = refreshTokenManageService.addTokenHeader(request);
						return next(requestClone);
					}),
					catchError(() => {
						console.log('*******ERROR EN EL REFRESH TOKEN********');
						router.navigateByUrl('/');
						return EMPTY;
					})
				);
			}
			return throwError(() => error);
		})
	);
};
