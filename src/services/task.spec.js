import nock from 'nock'
import { TaskService } from './task'
import { ApiClient } from '../api'

const responseJSON = `[{"id":172800000,"name":"teste","description":"migeh"},{"id":172800100,"name":"teste 2","description":"migeh 2"}]`
const baseUrl = `https://gerere-gerere.o.lsd/`
const client = new ApiClient(baseUrl);
const taskService = new TaskService(client);

describe(`Tasks Service`, () => {
  
  it(`Should parse the response into an valid user object`, () => {
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

  it(`Should not fail when no tasks are found`, () => {
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

  it(`Should fetch a single task properly`, () => {
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
});