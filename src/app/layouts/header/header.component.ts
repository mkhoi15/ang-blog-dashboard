import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  email: string = '';
  isLoggin$!: Observable<boolean>;

  constructor() {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        // Current User Using signal
        //this.authService.currentUserSig.set(user);

        // Current User using localStorage
        localStorage.setItem('user', JSON.stringify(user));
        this.email = JSON.parse(localStorage.getItem('user') || '{}').email;
      } else {
        this.authService.currentUserSig.set(null);
      }
      //console.log('Current User using signal', this.authService.currentUserSig());
      // console.log(user);
    });
    this.isLoggin$ = this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
