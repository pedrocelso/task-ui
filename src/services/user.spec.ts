import nock from 'nock'
import { User, UserService } from './user'
import { ApiClient } from '../api'
import { fork } from 'fluture'

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

    const successHandler = (userList: User[]) => {
      expect(userList[0].name).toEqual(`john`)
      expect(userList[0].email).toEqual(`john@whatever.com`)

      expect(userList[1].name).toEqual(`john t`)
      expect(userList[1].email).toEqual(`john@whatever.com`)

      expect(userList[2].name).toEqual(`Renato Russo`)
      expect(userList[2].email).toEqual(`renato@legiao.com.br`)
    }

    userService.getUsers()
      .pipe(fork(fail)(successHandler))
  });

  it(`Should not fail when no users are found`, () => {
    nock(baseUrl)
      .get(`/users/`)
      .reply(200, `[]`)

    expect.assertions(1);

    const successHandler = (userList: User[]) => {
      expect(userList.length).toEqual(0)
    }

    userService.getUsers()
      .pipe(fork(fail)(successHandler))
  });

  it(`Should fetch a single user properly`, () => {
    nock(baseUrl)
      .get(`/users/renato@legiao.com.br`)
      .reply(200, `{
      "name": "Renato Russo",
      "email": "renato@legiao.com.br"
    }`)

    expect.assertions(2);

    const successHandler = (user: User) => {
      expect(user.name).toEqual(`Renato Russo`)
      expect(user.email).toEqual(`renato@legiao.com.br`)
    }

    userService.getUser(`renato@legiao.com.br`)
      .pipe(fork(fail)(successHandler))
  });

  it(`Should authenticate an user properly`, () => {
    nock(baseUrl)
      .post(`/public/signin`)
      .reply(200, `{
      "token": "magic token"
    }`)

    const publicUserService = new UserService(new ApiClient(baseUrl));

    expect.assertions(1);

    const successHandler = ({ token }: { token: string }) => {
      expect(token).toEqual(`magic token`)
    }

    publicUserService.authenticate({ email: `renato@legiao.com.br`, password: `utevo lux` })
      .pipe(fork(fail)(successHandler))
  });

  it(`Should create an user properly`, () => {
    nock(baseUrl)
      .post(`/public/signup`)
      .reply(200, `{"user":{"name": "Renato Russo", "email": "renato@legiao.com.br"}}`)

    const publicUserService = new UserService(new ApiClient(baseUrl));

    expect.assertions(2);

    const successHandler = ({user}: { user: User }) => {
      expect(user.name).toEqual(`Renato Russo`)
      expect(user.email).toEqual(`renato@legiao.com.br`)
    }

    publicUserService.createUser({ name: `Renato Russo`, email: `renato@legiao.com.br`, password: `utevo lux` })
      .pipe(fork(fail)(successHandler))
  });
});