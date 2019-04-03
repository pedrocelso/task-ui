import {encase, FutureInstance} from 'fluture'
import {ApiClient, Endpoints, HttpResponse} from '../api'

export interface User {
  name: string;
  email: string;
}

export interface UserService {
  getUsers(client : ApiClient): FutureInstance<{}, User[]>;
}

export const usersService: UserService = {
  getUsers: (client : ApiClient): FutureInstance<{}, User[]> => 
    client.get<{}, HttpResponse>(Endpoints.USERS)
    .map(res => res.body)
    .chain<User[]>(encase(JSON.parse))
}
