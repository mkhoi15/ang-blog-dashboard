import { ToastrService } from 'ngx-toastr';
import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  user,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  currentUserSig = signal<User | null | undefined>(undefined);
  isLoggin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLogginGuard: boolean = false;

  constructor(private toastr: ToastrService) {}

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.isLoggin.next(true);
        this.isLogginGuard = true;
        this.toastr.success('Login successfully!');
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = this.auth.signOut().then(() => {
      this.isLoggin.next(false);
      this.isLogginGuard = false;
      this.toastr.success('Logout successfully!');
    });
    return from(promise);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggin.asObservable();
  }
}
