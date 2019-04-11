import request from 'request-promise'
import Future, { FutureInstance } from 'fluture'

export interface ApiClient {
  get<T, P>(endpoint: string, options?: request.Options): FutureInstance<T, P>;
}

export interface HttpResponse {
  body: string;
}

export const Endpoints = {
  USERS: `users/`,
  TASKS: `tasks/`
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
          headers: {
              'Access-Control-Allow-Origin': `*`,
              'Authorization': `Bearer ${jwtToken}`
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
}
