import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { User, UserRole } from '../domain/user';

export interface LoginRequest {
  username: string,
  password: string;
}

export interface LoginResponse extends User {
  token: string;
}
export interface RegisterRequest extends User {}

const UserStorageKey = 'user';
const TokenStorageKey = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentToken: string | null = null;

  get user(): User {
    if (!this.currentUser)
      this.currentUser = JSON.parse(sessionStorage.getItem(UserStorageKey) as string);
    return this.currentUser as User;
  }

  get token(): string {
    if (!this.currentToken)
      this.currentToken = sessionStorage.getItem(TokenStorageKey) as string;
    return this.currentToken as string;
  }
  get isLoggedIn(): boolean {
    return this.token !== null;
  }

  get isAdmin(): boolean {
    return this.user?.role === UserRole.Admin;
  }

  constructor(private httpClient: HttpClient) { }

  login(LoginRequest: LoginRequest): Observable<LoginResponse> {
    const user = this.httpClient.post<LoginResponse>('/api/user/login', LoginRequest);
    user.subscribe({
      next: (user) => this.setUser(user),
    });
    return user;
  }

  logout() {
    console.log("LOGOUT");

    this.setUser(null);
  }

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    const user = this.httpClient.post<LoginResponse>('/api/user/register', registerRequest);
    user.subscribe(user => this.setUser(user));
    return user;
  }

  private setUser(user: LoginResponse | null): void {
    if (user) {
      sessionStorage.setItem(TokenStorageKey, user.token);
      sessionStorage.setItem(UserStorageKey, JSON.stringify(user));
      document.cookie = `${TokenStorageKey}=${user.token}`;
      document.cookie = `${UserStorageKey}=${JSON.stringify(user)}`;
    } else {
      sessionStorage.removeItem(TokenStorageKey);
      sessionStorage.removeItem(UserStorageKey);
    }
    this.currentUser = user;
    this.currentToken = user?.token || null;
  }

}
