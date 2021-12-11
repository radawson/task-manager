import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  faLock = faLock;
  faUser = faUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLoginButtonClicked(username: string, password: string) {
    this.authService.login(username, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    })
  }

}
