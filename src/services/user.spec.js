import nock from 'nock'
import { UserService } from './user'
import { ApiClient } from '../api'

const responseJSON = `[{"name":"john","email":"john@whatever.com"},{"name":"john t","email":"john@whatever.com"},{"name":"Renato Russo","email":"renato@legiao.com.br"}]`
const baseUrl = `https://gerere-gerere.o.lsd/`
const client = new ApiClient(baseUrl, `coolToken`);
const userService = new UserService(client);

describe(`Users Service`, () => {
  
  it(`Should parse the response into an valid user object`, () => {
    nock(baseUrl)
    .get(`/users/`)
    .reply(200, responseJSON)
    
    expect.assertions(6);
    return userService.getUsers()
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

  it(`Should not fail when no users are found`, () => {
    nock(baseUrl)
    .get(`/users/`)
    .reply(200, `[]`)
    
    expect.assertions(1);
    return userService.getUsers()
      .promise()
      .then(userList => {
        expect(userList.length).toEqual(0)
      })
  });

  it(`Should fetch a single user properly`, () => {
    nock(baseUrl)
    .get(`/users/renato@legiao.com.br`)
    .reply(200, `{
      "name": "Renato Russo",
      "email": "renato@legiao.com.br"
    }`)

    expect.assertions(2);
    return userService.getUser(`renato@legiao.com.br`)
      .promise()
      .then(user => {
        expect(user.name).toEqual(`Renato Russo`)
        expect(user.email).toEqual(`renato@legiao.com.br`)
      })
  });

  it(`Should authenticate an user properly`, () => {
    nock(baseUrl)
    .post(`/public/signin`)
    .reply(200, `{
      "token": "magic token"
    }`)

    const publicUserService = new UserService(new ApiClient(baseUrl));

    expect.assertions(1);
    return publicUserService.authenticate({email: `renato@legiao.com.br`, password: `utevo lux`})
      .promise()
      .then(({token}) => {
        expect(token).toEqual(`magic token`)
      })
  });
});