import React from 'react';
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { TaskList } from './task-list'

describe(`<TaskList />`, () => {
  it(`Should fetch the tasks from service and render`, () => {
    const service = {
      getTasks: (_) => ({
        fork: (rej, res) => {
          res([
            { id: 10, name: `test`, description: `test@test.com` },
            { id: 11, name: `test1`, description: `test1@test.com` },
          ])
        }
      })
    }

    const component = shallow(
      <TaskList service={service} deauthenticate={sinon.fake()} />,
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
      <TaskList service={service} deauthenticate={sinon.fake()} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should deauthenticate user in case of 401 return from server`, () => {
    const props = {
      service: {
        getTasks: (_) => ({
          fork: (rej, res) => {
            rej({ statusCode: 401 })
          }
        })
      },
      deauthenticate: sinon.spy()
    }

    const component = shallow(
      <TaskList {...props} />,
    );

    expect(props.deauthenticate.called).toBeTruthy();
  });

  it(`.toggleEditor() - Should toggle the Editor dialog`, () => {
    const props = {
      service: {
        getTasks: (_) => ({
          fork: (rej, res) => {
            rej({ statusCode: 401 })
          }
        })
      },
      deauthenticate: sinon.spy()
    }

    const component = shallow(
      <TaskList {...props} />,
    );

    const toggler = component.instance().toggleEditor()

    toggler(true)
    expect(component.state().editorOpen).toBeTruthy()
    toggler(false)
    expect(component.state().editorOpen).toBeFalsy()

    component.instance().showEditor()
    expect(component.state().editorOpen).toBeTruthy()

    component.instance().closeEditor()
    expect(component.state().editorOpen).toBeFalsy()
  });
});
