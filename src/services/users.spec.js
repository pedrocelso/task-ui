import nock from 'nock'
import { usersService } from './users'
import { ApiClient } from '../api'

const responseJSON = `[{"name":"john","email":"john@whatever.com"},{"name":"john t","email":"john@whatever.com"},{"name":"Renato Russo","email":"renato@legiao.com.br"}]`
const baseUrl = `https://gerere-gerere.o.lsd/`
const client = new ApiClient(baseUrl);

describe(`Users Service`, () => {
  nock(baseUrl)
  .get(`/users/`)
  .reply(200, responseJSON)

  it(`Should parse the response into an valid user object`, () => {
    expect.assertions(6);
    return usersService.getUsers(client)
      .promise()
      .then(userList => {
        expect(userList[0].name).toEqual(`john`)
        expect(userList[0].email).toEqual(`john@whatever.com`)
    
        expect(userList[1].name).toEqual(`john t`)
        expect(userList[1].email).toEqual(`john@whatever.com`)
    
        expect(userList[2].name).toEqual(`Renato Russo`)
        expect(userList[2].email).toEqual(`renato@legiao.com.br`)
      })
  });
});