import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../domain/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCache: {[key: string]: Observable<User>} = {};

  constructor(private httpClient: HttpClient) { }

  getUser(userId: string): Observable<User> {
    if (this.userCache[userId])
      return this.userCache[userId];
    const observable = this.httpClient.get<User>(`/api/user/${userId}`);
    this.userCache[userId] = observable;
    return observable;
  }
}
