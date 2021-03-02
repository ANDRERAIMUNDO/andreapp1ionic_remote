import { StorageService } from './../services/storage.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let N = API_CONFIG.baseUrl.length;
    let requestToApi = req.url.substring(0, N) == API_CONFIG.baseUrl;
    let localUser = this.storage.getLocalUser();

    if (localUser && requestToApi) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + localUser.token) });

      return next.handle(authReq);
    }
    else {
      return next.handle(req);
    }
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
