import { encase, FutureInstance } from 'fluture'
import { ApiClient, Endpoints, HttpResponse, ResponseError } from '../api'
import { pathOr } from 'ramda';

export interface User {
  email: string;
  name?: string;
  password?: string;
}

export interface UserService {
  getUsers(): FutureInstance<ResponseError, User[]>;
  getUser(userEmail: string): FutureInstance<ResponseError, User>;
  createUser(user: User): FutureInstance<ResponseError, { user: User }>;
  authenticate(user: User): FutureInstance<ResponseError, { token: string }>;
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

  getUser(userEmail: string): FutureInstance<ResponseError, User> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.USERS, { uri: userEmail })
      .map(res => res.body)
      .chain<User>(encase(JSON.parse))
  }

  createUser(user: User): FutureInstance<ResponseError, { user: User }> {
    return this.client.post<ResponseError, HttpResponse>(Endpoints.PUBLIC, { uri: `signup`, body: JSON.stringify(user) })
      .map(res => res.body)
      .chain<{ user: User }>(encase(JSON.parse))
  }

  authenticate(user: User): FutureInstance<ResponseError, { token: string }> {
    return this.client.post<ResponseError, HttpResponse>(Endpoints.PUBLIC, { uri: `signin`, body: JSON.stringify(user) })
      .map(res => res.body)
      .chain<{ token: string }>(encase(JSON.parse))
  }
}
