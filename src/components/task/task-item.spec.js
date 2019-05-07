import React from 'react';
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {formatTime, TaskItem} from './task-item'

const baseTask = {
  id: 123,
  name: `POI quest service`,
  description: `Do A POI quest service`,
  creationTime: 1556924666404,
  updateTime: 1556924566404
}

describe(`<TaskItem />`, () => {
  it(`Should render the task without errors`, () => {
    const service = {
      getTasks: sinon.fake()
    }
    const component = shallow(
      <TaskItem task={baseTask}/>,
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
});