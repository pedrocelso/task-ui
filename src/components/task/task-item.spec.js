import React from 'react';
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {formatTime, TaskItem} from './task-item'

const baseTask = {
  id: 123,
  name: `POI quest service`,
  description: `Do A POI quest service`,
  creationTime: 1556924666404,
  updateTime: 1556924566404,
  incidentsCount: 1,
  pendingIncidentsCount: 1
}

const deauthenticate = sinon.fake()

describe(`<TaskItem />`, () => {
  it(`Should render the task without errors`, () => {
    const service = sinon.fake()
    const component = shallow(
      <TaskItem task={baseTask} service={service} deauthenticate={deauthenticate} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should render the task with no incidents without errors`, () => {
    const service = sinon.fake()
    const task = {
      ...baseTask,
      incidentsCount: 0,
      pendingIncidentsCount: 0
    }
    const component = shallow(
      <TaskItem task={task} service={service} deauthenticate={deauthenticate} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.formatTime() - Should format date properly`, () => {
    const formattedDate = formatTime(1556924666404)
    expect(formattedDate).toEqual(`2019/05/03, 4:04:26 pm`)
  });

  it(`.formatTime() - Should retutn n/a for 0 millis`, () => {
    const formattedDate = formatTime(0)
    expect(formattedDate).toEqual(`n/a`)
  });

  it(`Should load incidents from service`, () => {
    const service = {
      getIncidents: (_) => ({
        fork: (rej, res) => {
          res([
            { id: 10, name: `test`, description: `test@test.com` },
            { id: 11, name: `test1`, description: `test1@test.com` },
          ])
        }
      })
    }
    const component = shallow(
      <TaskItem task={baseTask} service={service} deauthenticate={deauthenticate} />,
    );

    component.setState({loadingIncidents: true})

    component.instance().loadIncidents()();
    const state = component.instance().state

    expect(state.loadingIncidents).toBeFalsy()
    expect(state.incidents.length).toEqual(2)
    expect(state.incidents[0].id).toEqual(10)
    expect(state.incidents[0].name).toEqual(`test`)
    expect(state.incidents[0].description).toEqual(`test@test.com`)
    expect(state.incidents[1].id).toEqual(11)
    expect(state.incidents[1].name).toEqual(`test1`)
    expect(state.incidents[1].description).toEqual(`test1@test.com`)
  });

  it(`Should deauthenticate with 401 response`, () => {
    const service = {
      getIncidents: (_) => ({
        fork: (rej, res) => {
          rej({statusCode: 401})
        }
      })
    }

    const deauthenticate = sinon.spy()

    const component = shallow(
      <TaskItem task={baseTask} service={service} deauthenticate={deauthenticate} />,
    );

    component.setState({loadingIncidents: true})
    component.instance().loadIncidents()();
    expect(deauthenticate.calledOnce).toBeTruthy()
  });

  it(`Should change loading state when status code is not 401`, () => {
    const service = {
      getIncidents: (_) => ({
        fork: (rej, res) => {
          rej({statusCode: 503})
        }
      })
    }

    const deauthenticate = sinon.spy()

    const component = shallow(
      <TaskItem task={baseTask} service={service} deauthenticate={deauthenticate} />,
    );

    component.setState({loadingIncidents: true})
    component.instance().loadIncidents()();
    expect(deauthenticate.called).toBeFalsy()
    expect(component.instance().state.loadingIncidents).toBeFalsy()
  });

  it(`Should not load anythong if task has no incidents`, () => {
    const forkSpy = sinon.spy()
    const service = {
      getIncidents: (_) => ({
        fork: forkSpy
      })
    }

    const deauthenticate = sinon.spy()
    const task = {
      ...baseTask,
      incidentsCount: 0
    }

    const component = shallow(
      <TaskItem task={task} service={service} deauthenticate={deauthenticate} />,
    );

    component.instance().loadIncidents()();
    expect(forkSpy.called).toBeFalsy()
    expect(component.instance().state.loadingIncidents).toBeFalsy()
  });
});