import React from 'react';
import {shallow} from 'enzyme'
import nock from 'nock'

import UserList from './user-list'

describe(`<UserList />`, () => {
  it(`Should fetch the users from service and render`, () => {
    const service = {
      getUsers: (_) => ({
        fork: (rej, res) => {
          res([
            { name: `john`, email: `john@whatever.com` },
            { name: `john t`, email: `john@whatever.com` },
            { name: `Renato Russo`, email: `renato@legiao.com.br` },
          ])
        }
      })
    }

    const component = shallow(
      <UserList service={service}/>,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should not display users if service returns an error`, () => {
    const service = {
      getUsers: (_) => ({
        fork: (rej, _) => {
          rej(`error fetching users`)
        }
      })
    }

    const component = shallow(
      <UserList service={service}/>,
    );

    expect(component).toMatchSnapshot();
  });
});