import React from 'react';
import {shallow} from 'enzyme'

import TaskList from './task-list'

describe(`<TaskList />`, () => {
  it(`Should fetch the tasks from service and render`, () => {
    const service = {
      getTasks: (_) => ({
        fork: (rej, res) => {
          res([
            { id: 10, name: `test`, email: `test@test.com` },
            { id: 11, name: `test1`, email: `test1@test.com` },
          ])
        }
      })
    }

    const component = shallow(
      <TaskList service={service}/>,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should not display tasks if service returns an error`, () => {
    const service = {
      getTasks: (_) => ({
        fork: (rej, _) => {
          rej(`error fetching tasks`)
        }
      })
    }

    const component = shallow(
      <TaskList service={service}/>,
    );

    expect(component).toMatchSnapshot();
  });
});