import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  adduser(username: string, password: string, level: number) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      username,
      password,
      level
    }, {
      observe: 'response'
    });
  }

  login(username: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      username,
      password
    }, {
      observe: 'response'
    });
  }
}
