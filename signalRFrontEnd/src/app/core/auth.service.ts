import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { firstValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string | Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  private userName = '';
  private userPassword = '';

  get token() {
    return this.accessToken;
  }

  public async login(username: string, password: string) {
    this.userName = username;
    this.userPassword = password;

    const response = await firstValueFrom(this.post<TokenResponse>('auth/login', { username, password }));

    const data = response && typeof response === 'object' && 'body' in response
      ? (response as any).body as TokenResponse
      : response as unknown as TokenResponse;

    if (!data) {
      throw new Error('Login failed - no response received');
    }

    this.setTokens(data);
  }

  public async reLogin() {
    if (!this.userName || !this.userPassword) {
      throw new Error('No stored username/password for re-login');
    }

    const response = await firstValueFrom(this.post<TokenResponse>('auth/login', { username: this.userName, password: this.userPassword }));

    const data = response && typeof response === 'object' && 'body' in response
      ? (response as any).body as TokenResponse
      : response as unknown as TokenResponse;

    if (!data) {
      throw new Error('Login failed - no response received');
    }

    this.setTokens(data);
    return true;
  }

  // async tryRefresh() {
  //   if (!this.refreshToken) return false;

  //   const response = await firstValueFrom(this.post<TokenResponse>('auth/refresh', {
  //     refreshToken: this.refreshToken,
  //   }));

  //   const data = response && typeof response === 'object' && 'body' in response
  //     ? (response as any).body as TokenResponse
  //     : response as unknown as TokenResponse;

  //   if (!data) return false;
  //   this.setTokens(data);
  //   return true;
  // }

  private setTokens(data: TokenResponse) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.expiresAt = new Date(data.expiresAtUtc).getTime();
  }

  // isExpiringSoon(seconds = 30) {
  //   return Date.now() > this.expiresAt - seconds * 1000;
  // }
}
