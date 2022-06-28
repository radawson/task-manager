import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faLock, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  faLock = faLock;
  faUser = faUser;
  faShield = faUserShield;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onCreateButtonClicked(username: string, password: string, levelStr: string) {
    let level = 0;
    try {
      level = parseInt(levelStr);
    } catch {
      level = 0;
    }

    this.authService.adduser(username, password, level).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    })
  }
}
