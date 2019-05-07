import {encase, FutureInstance} from 'fluture'
import {ApiClient, Endpoints, HttpResponse, ResponseError} from '../api'

export interface Task {
  id: number;
  name: string;
  description: string;
  creationTime: number;
  updateTime: number;
  incidentsCount: number;
}

export interface Incident {
  id: number;
  taskId: number;
  name: string;
  description: string;
  creationTime: number;
  updateTime: number;
}

export interface TaskService {
  getTasks(): FutureInstance<{}, Task[]>;
  getTask(id: number): FutureInstance<{}, Task>;
  getIncidents(taskId: number): FutureInstance<{}, Incident[]>;
  getIncident(taskId: number, id: number): FutureInstance<{}, Incident>;
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

  getIncidents(taskId: number): FutureInstance<ResponseError, Incident[]> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.INCIDENT(taskId))
    .map(res => res.body)
    .chain<Incident[]>(encase(JSON.parse))
  }

  getIncident(taskId: number, id: number): FutureInstance<ResponseError, Incident> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.INCIDENT(taskId), {uri: `${id}`})
    .map(res => res.body)
    .chain<Incident>(encase(JSON.parse))
  }
}
