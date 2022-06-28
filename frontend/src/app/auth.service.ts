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

  adduser(username: string, password: string, level: number) {
    return this.webService.adduser(username, password, level).pipe(
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
        }
      })
    )
  }

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
        }
      })
    )
  }

  logout() {
    this.removeSession();

    this.router.navigateByUrl('/login');
  }

  getAccessToken() {
    return this.nullFilter(localStorage.getItem('x-access-token'));
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-token', accessToken);
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(this.nullFilter(res.headers.get('x-access-token')));
      })
    )
  }

  getRefreshToken(): string {
    return this.nullFilter(localStorage.getItem('refresh-token'));
  }

  setRefreshToken(refreshToken: string) {
    return localStorage.setItem('refresh-token', refreshToken);
  }

  getUserId() {
    return this.nullFilter(localStorage.getItem('user-id'));
  }

  private nullFilter(rawInput: string | null): string {
    if (rawInput !== null) {
      return rawInput
    } else {
      return '0';
    }
  }
  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }
}
