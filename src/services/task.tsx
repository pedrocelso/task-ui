import { chain, encase, FutureInstance, map } from 'fluture'
import { ApiClient, Endpoints, HttpResponse, ResponseError } from '../api'

export interface Task {
  id: number;
  name: string;
  description: string;
  creationTime: number;
  updateTime: number;
  incidentsCount: number;
  pendingIncidentsCount: number;
}

export interface Incident {
  id: number;
  taskId: number;
  name: string;
  description: string;
  creationTime: number;
  updateTime: number;
  status: number;
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
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, Task[]>(encase(JSON.parse)))
  }

  getTask(id: number): FutureInstance<ResponseError, Task> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.TASKS, { uri: `${id}` })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, Task>(encase(JSON.parse)))
  }

  getIncidents(taskId: number): FutureInstance<ResponseError, Incident[]> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.INCIDENT(taskId))
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, Incident[]>(encase(JSON.parse)))
  }

  getIncident(taskId: number, id: number): FutureInstance<ResponseError, Incident> {
    return this.client.get<ResponseError, HttpResponse>(Endpoints.INCIDENT(taskId), { uri: `${id}` })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, Incident>(encase(JSON.parse)))
  }

  createTask(task: Task): FutureInstance<ResponseError, { task: Task }> {
    return this.client.post<ResponseError, HttpResponse>(Endpoints.TASKS, { uri: ``, body: JSON.stringify(task) })
      .pipe(map<HttpResponse, string>(res => res.body))
      .pipe(chain<ResponseError, string, { task: Task }>(encase(JSON.parse)))
  }
}
