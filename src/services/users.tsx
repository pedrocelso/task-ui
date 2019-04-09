import {encase, FutureInstance} from 'fluture'
import {curry} from 'ramda'
import {ApiClient, Endpoints, HttpResponse} from '../api'

export interface User {
  name: string;
  email: string;
}

export interface UserService {
  getUsers(): FutureInstance<{}, User[]>;
  getUser(userEmail: string): FutureInstance<{}, User[]>;
}

export class UserService implements UserService {
  client: ApiClient

  constructor(client: ApiClient) {
    this.client = client;
  }

  getUsers(): FutureInstance<{}, User[]> {
    return this.client.get<{}, HttpResponse>(Endpoints.USERS)
    .map(res => res.body)
    .chain<User[]>(encase(JSON.parse))
  }
  
  getUser(userEmail: string): FutureInstance<{}, User> {
    return this.client.get<{}, HttpResponse>(Endpoints.USERS, {uri: userEmail})
    .map(res => res.body)
    .chain<User>(encase(JSON.parse))
  }
}
