import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiModel } from '../models';
import { UriConstants } from '../utils';

export interface IResponseRefreshToken {
	accessToken: string;
	refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService<GET = {}, POST = {}, PUT = {}, PATCH = {}, DELETE = {}> {
  constructor(private http: HttpClient) {}

  /** Para realizar las peticiones GET */
  getService(reqParams: ApiModel.ReqParams): Observable< ApiModel.ResponseParams<GET>> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.get<ApiModel.ResponseParams<GET>>(reqParams.url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getListService(reqParams: ApiModel.ReqParams): Observable< ApiModel.ResponseParams<GET[]>> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.get<ApiModel.ResponseParams<GET[]>>(reqParams.url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }


  /** Para realizar las peticiones POST */
  postService(reqParams: ApiModel.ReqParams): Observable<ApiModel.ResponseParams<POST>> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.post<ApiModel.ResponseParams<POST>>(reqParams.url, reqParams.data, options ).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /** Para realizar las peticiones PATCH */
  patchService(reqParams: ApiModel.ReqParams): Observable<ApiModel.ResponseParams<PATCH>> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.patch<ApiModel.ResponseParams<PATCH>>(reqParams.url, reqParams.data, options ).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /** Para realizar las peticiones PUT */
  putService(reqParams: ApiModel.ReqParams): Observable<ApiModel.ResponseParams<PUT>> {
    const options = {
      params: reqParams.params ? reqParams.params : {},
    };
    return this.http.put<ApiModel.ResponseParams<PUT>>(reqParams.url, reqParams.data, options ).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  /** Para realizar las peticiones DELETE*/
  deleteService(reqParams: ApiModel.ReqParams): Observable<ApiModel.ResponseParams<DELETE>> {
    const options = {
      body: reqParams.data,
      params: reqParams.params,
    };
    return this.http.delete<ApiModel.ResponseParams<DELETE>>(reqParams.url, options).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.response || 'An error occurred');
  }


  refreshToken() {
    return  this.http.get<IResponseRefreshToken>(UriConstants.AUTH_REFRESH);
	}

}
