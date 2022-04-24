import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
  }

}
