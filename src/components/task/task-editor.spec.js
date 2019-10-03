import React from 'react';
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { TaskEditor, Transition } from './task-editor'

const baseProps = {
  deauthenticate: sinon.fake(),
  open: sinon.fake(),
  close: sinon.fake(),
  editor: {
    open: false
  },
  service: {
    createTask: (_) => ({
      fork: (rej, res) => {
        rej({ statusCode: 401 })
      }
    })
  }
}

describe(`<TaskEditor />`, () => {
  it(`Should render when it is open`, () => {
    const component = shallow(
      <TaskEditor {...baseProps} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should not render when it is open`, () => {
    const props = {
      ...baseProps,
      editor: {
        open: false
      }
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.handleSubmit() - Successful response`, () => {
    const deauthenticate = sinon.spy()
    const service = {
      createTask: (_) => ({
        fork: (rej, res) => {
          res({ task: { id: 10, name: `test`, description: `test@test.com` } })
        }
      })
    }
    const close = sinon.spy()

    const props = {
      ...baseProps,
      deauthenticate,
      close,
      service
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );

    component.setState({ formData: { name: 'bar', description: 'foo' } });
    component.instance().handleSubmit()

    expect(close.called).toBeTruthy()
    expect(component.state().loading).toBeFalsy()
    expect(component.state().formData).toMatchObject({})
  });

  it(`.handleSubmit() - 401 response`, () => {
    const deauthenticate = sinon.spy()
    const service = {
      createTask: (_) => ({
        fork: (rej, res) => {
          rej({ statusCode: 401 })
        }
      })
    }
    const close = sinon.spy()

    const props = {
      ...baseProps,
      deauthenticate,
      close,
      service
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );
    component.setState({ formData: { name: 'bar', description: 'foo' } });
    component.instance().handleSubmit()

    expect(close.called).toBeFalsy()
    expect(deauthenticate.called).toBeTruthy()
    expect(component.state().loading).toBeFalsy()
  });

  it(`.handleSubmit() - Error response`, () => {
    const deauthenticate = sinon.spy()
    const service = {
      createTask: (_) => ({
        fork: (rej, res) => {
          rej(`error fetching tasks`)
        }
      })
    }
    const close = sinon.spy()

    const props = {
      ...baseProps,
      deauthenticate,
      close,
      service
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );

    component.setState({ formData: { name: 'bar', description: 'foo' } });
    component.instance().handleSubmit()
    expect(close.called).toBeFalsy()
    expect(deauthenticate.called).toBeFalsy()
    expect(component.state().loading).toBeFalsy()
    expect(component.state().formData).toMatchObject({ name: 'bar', description: 'foo' })
  });

  it(`.handleClose() - Should close the dialog`, () => {
    const close = sinon.spy()

    const props = {
      ...baseProps,
      close
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );

    component.instance().handleClose()
    expect(close.called).toBeTruthy()
  });

  it(`.handleChange() - Should update the formData`, () => {
    const component = shallow(
      <TaskEditor {...baseProps} />,
    );

    component.instance().handleChange({ formData: { name: `migeh`, description: `maneh` } })
    expect(component.state().formData).toMatchObject({ name: 'migeh', description: 'maneh' })
  });

  it(`Transition - Should render when it is open`, () => {
    const props = {
      ...baseProps,
      editor: {
        open: true
      }
    }
    const component = shallow(
      <TaskEditor {...props} />,
    );

    expect(component).toMatchSnapshot();  
  });
});
