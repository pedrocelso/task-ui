import {encase, FutureInstance} from 'fluture'
import {ApiClient, Endpoints, HttpResponse, ResponseError} from '../api'

export interface Task {
  id: number;
  name: string;
  description: string;
  creationTime: number;
  updateTime: number;
}

export interface TaskService {
  getTasks(): FutureInstance<{}, Task[]>;
  getTask(id: number): FutureInstance<{}, Task>;
}

export class TaskService implements TaskService {
  client: ApiClient

  constructor(client: ApiClient) {
    this.client = client;
  }

  getTasks(): FutureInstance<ResponseError, Task[]> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.TASKS)
    .map(res => res.body)
    .chain<Task[]>(encase(JSON.parse))
  }
  
  getTask(id: number): FutureInstance<ResponseError, Task> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.TASKS, {uri: `${id}`})
    .map(res => res.body)
    .chain<Task>(encase(JSON.parse))
  }
}
