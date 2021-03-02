import { JwtHelperService } from '@auth0/angular-jwt';
import { CartService } from './domain/cart.service';
import { StorageService } from './storage.service';
import { API_CONFIG } from './../config/api.config';
import { HttpClient } from '@angular/common/http';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from '@angular/core';
import { LocalUser } from '../models/local_user';

@Injectable()
export class AuthService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(public http: HttpClient,
    public storage: StorageService,
    public cartservice: CartService) {

  }
  authenticate(creds: CredenciaisDTO) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`,
      creds, {
      observe: 'response',
      responseType: 'text'
    });
  }

  refreshToken() {
    return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
      {},
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  successfullLogin(authorizationValue: string) {
    let tok = authorizationValue.substring(7);
    let user: LocalUser = {
      token: tok,
      email: this.jwtHelper.decodeToken(tok).sub
    };
    this.storage.setLocalUser(user);
    this.cartservice.createOrClearCart();
  }
  logout() {
    this.storage.setLocalUser(null);
  }
}
