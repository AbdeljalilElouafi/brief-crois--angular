import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, of, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';


  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() { }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(createdUser => {

      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];

          const { password, ...userWithoutPassword } = user;
          this.saveUserToStorage(userWithoutPassword);
          this.currentUser.set(userWithoutPassword);
          return userWithoutPassword;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  private saveUserToStorage(user: User) {

    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
