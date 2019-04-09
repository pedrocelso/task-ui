import request from 'request-promise'
import Future, { FutureInstance } from 'fluture'

const baseUrl = `https://api-dot-go-rest-service.appspot.com/v1/`

export interface ApiClient {
  get<T, P>(endpoint: string, options?: request.Options): FutureInstance<T, P>;
}

export interface HttpResponse {
  body: string;
}

export const Endpoints = {
  USERS: `users/`
}

export class ApiClient implements ApiClient {
    options: request.Options;

    constructor(apiBaseUrl: string) {
        this.options = {
          baseUrl: apiBaseUrl,
          uri: ``,
          withCredentials: false,
          removeRefererHeader: true,
          followAllRedirects: true,
          resolveWithFullResponse: true,
          headers: {
              'Access-Control-Allow-Origin': `*`,
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVuYXRvIFJ1c3NvIiwiZW1haWwiOiJyZW5hdG9AbGVnaWFvLmNvbS5iciJ9.HfWOWyvl4yjcODEUHBeaihZlnPXSuKCYiIUvfpp_rg4`
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

export default new ApiClient(baseUrl);