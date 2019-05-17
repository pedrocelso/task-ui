import nock from 'nock'
import { TaskService } from './task'
import { ApiClient } from '../api'

const responseJSON = `[{"id":172800000,"name":"teste","description":"migeh"},{"id":172800100,"name":"teste 2","description":"migeh 2"}]`
const baseUrl = `https://gerere-gerere.o.lsd/`
const client = new ApiClient(baseUrl);
const taskService = new TaskService(client);

describe(`Tasks Service`, () => {
  it(`Task: Should parse the response into an valid user object`, () => {
    nock(baseUrl)
      .get(`/tasks/`)
      .reply(200, responseJSON)

    expect.assertions(7);
    return taskService.getTasks()
      .promise()
      .then(taskList => {
        expect(taskList.length).toEqual(2)
        expect(taskList[0].id).toEqual(172800000)
        expect(taskList[0].name).toEqual(`teste`)
        expect(taskList[0].description).toEqual(`migeh`)

        expect(taskList[1].id).toEqual(172800100)
        expect(taskList[1].name).toEqual(`teste 2`)
        expect(taskList[1].description).toEqual(`migeh 2`)
      })
  });

  it(`Task: Should not fail when no tasks are found`, () => {
    nock(baseUrl)
      .get(`/tasks/`)
      .reply(200, `[]`)

    expect.assertions(1);
    return taskService.getTasks()
      .promise()
      .then(taskList => {
        expect(taskList.length).toEqual(0)
      })
  });

  it(`Task: Should fetch a single task properly`, () => {
    nock(baseUrl)
      .get(`/tasks/172800000`)
      .reply(200, `{"id":172800000,"name":"teste","description":"migeh"}`)

    expect.assertions(3);
    return taskService.getTask(172800000)
      .promise()
      .then(task => {
        expect(task.id).toEqual(172800000)
        expect(task.name).toEqual(`teste`)
        expect(task.description).toEqual(`migeh`)
      })
  });

  it(`Task: Should create a single task properly`, () => {
    nock(baseUrl)
      .post(`/tasks/`)
      .reply(200, `{"id":5693890598273024,"name":"test","description":"test","creationTime":1558103573817,"updateTime":0,"active":true,"incidentsCount":0,"pendingIncidentsCount":0}`)

    expect.assertions(3);
    return taskService.createTask({
      name: `test`,
      description: `test`
    })
      .promise()
      .then(task => {
        expect(task.id).toEqual(5693890598273024)
        expect(task.name).toEqual(`test`)
        expect(task.description).toEqual(`test`)
      })
  });

  it(`Incident: Should fetch a single incident properly`, () => {
    nock(baseUrl)
      .get(`/task/10/incidents/172800000`)
      .reply(200, `{"id":172800000,"name":"teste","description":"migeh"}`)

    expect.assertions(3);
    return taskService.getIncident(10, 172800000)
      .promise()
      .then(incident => {
        expect(incident.id).toEqual(172800000)
        expect(incident.name).toEqual(`teste`)
        expect(incident.description).toEqual(`migeh`)
      })
  });

  it(`Incident: Should parse the response into an valid user object`, () => {
    nock(baseUrl)
      .get(`/task/10/incidents/`)
      .reply(200, responseJSON)

    expect.assertions(7);
    return taskService.getIncidents(10)
      .promise()
      .then(incidentList => {
        expect(incidentList.length).toEqual(2)
        expect(incidentList[0].id).toEqual(172800000)
        expect(incidentList[0].name).toEqual(`teste`)
        expect(incidentList[0].description).toEqual(`migeh`)

        expect(incidentList[1].id).toEqual(172800100)
        expect(incidentList[1].name).toEqual(`teste 2`)
        expect(incidentList[1].description).toEqual(`migeh 2`)
      })
  });

  it(`Incident: Should not fail when no incidents are found`, () => {
    nock(baseUrl)
      .get(`/task/10/incidents/`)
      .reply(200, `[]`)

    expect.assertions(1);
    return taskService.getIncidents(10)
      .promise()
      .then(incidentList => {
        expect(incidentList.length).toEqual(0)
      })
  });
});