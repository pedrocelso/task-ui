import {encase, FutureInstance} from 'fluture'
import {ApiClient, Endpoints, HttpResponse} from '../api'

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

  getTasks(): FutureInstance<{}, Task[]> {
    return this.client.get<{}, HttpResponse>(Endpoints.TASKS)
    .map(res => res.body)
    .chain<Task[]>(encase(JSON.parse))
  }
  
  getTask(id: number): FutureInstance<{}, Task> {
    return this.client.get<{}, HttpResponse>(Endpoints.TASKS, {uri: `${id}`})
    .map(res => res.body)
    .chain<Task>(encase(JSON.parse))
  }
}
