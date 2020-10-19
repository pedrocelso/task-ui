import { chain, encase, FutureInstance, map } from 'fluture'
import { ApiClient, Endpoints, HttpResponse, ResponseError } from '../api'

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
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<{}, string, User[]>(encase(JSON.parse)))
  }

  getUser(userEmail: string): FutureInstance<ResponseError, User> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.USERS, { uri: userEmail })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, User>(encase(JSON.parse)))
  }

  createUser(user: User): FutureInstance<ResponseError, { user: User }> {
    return this.client.post<ResponseError, HttpResponse>(Endpoints.PUBLIC, { uri: `signup`, body: JSON.stringify(user) })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, { user: User }>(encase(JSON.parse)))
  }

  authenticate(user: User): FutureInstance<ResponseError, { token: string }> {
    return this.client.post<ResponseError, HttpResponse>(Endpoints.PUBLIC, { uri: `signin`, body: JSON.stringify(user) })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, { token: string }>(encase(JSON.parse)))
  }
}
