import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  router = inject(Router);

  constructor(private authService: AuthService) {}
  ngOnInit(): void {}

  onSubmit(formValue: any) {
    this.authService.login(formValue.email, formValue.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
