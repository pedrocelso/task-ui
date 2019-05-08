import request from 'request-promise'
import Future, { FutureInstance } from 'fluture'

export interface ApiClient {
  get<T, P>(endpoint: string, options?: request.Options): FutureInstance<T, P>;
  post<T, P>(endpoint: string, options: request.Options): FutureInstance<T, P>;
  setAuthorizationToken(token: string): void;
}

export interface HttpResponse {
  body: string;
}

export interface ResponseError {
  statusCode: number;
}

export const Endpoints = {
  USERS: `users/`,
  TASKS: `tasks/`,
  INCIDENT: (taskID: string | number) => `task/${taskID}/incidents/`,
  PUBLIC: `public/`
}

export class ApiClient implements ApiClient {
    options: request.Options;

    constructor(apiBaseUrl: string, jwtToken: string) {
        this.options = {
          baseUrl: apiBaseUrl,
          uri: ``,
          withCredentials: false,
          removeRefererHeader: true,
          followAllRedirects: true,
          resolveWithFullResponse: true,
          headers: !!jwtToken ? {
              'Access-Control-Allow-Origin': `*`,
              'Authorization': `Bearer ${jwtToken}`
          } : {
            'Access-Control-Allow-Origin': `*`
          },
        }
    }

    get<T, P>(endpoint: string, options?: request.Options): FutureInstance<T, P> {
      return Future<T, P>((rej, res) => request({...this.options, baseUrl: `${this.options.baseUrl}${endpoint}`, ...options})
        .then(res)
        .catch(rej)
        .done()
      )
    }

    post<T, P>(endpoint: string, options: request.Options): FutureInstance<T, P> {
      return Future<T, P>((rej, res) => request.post({...this.options, baseUrl: `${this.options.baseUrl}${endpoint}`, ...options})
        .then(res)
        .catch(rej)
        .done()
      )
    }
}
