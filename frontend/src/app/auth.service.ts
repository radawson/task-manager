import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  login(username: string, password: string) {
    return this.webService.login(username, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //get auth token from header
        let accessToken = res.headers.get('x-access-token');
        console.log(accessToken);
        let refreshToken = res.headers.get('x-refresh-token');
        console.log(refreshToken);
        if (accessToken == null || refreshToken == null) {
          console.log('tokens missing from header');
        } else {
          this.setSession(res.body._id, accessToken, refreshToken);
          console.log('Logged In');
        }
      })
    )
  }

  logout() {
    this.removeSession();
  }

  getAccessToken() {
    return localStorage.getItem('access-token');
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  setRefreshToken(refreshToken: string) {
    return localStorage.setItem('refresh-token', refreshToken);
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}
