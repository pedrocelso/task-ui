import React from 'react';
import {mount} from 'enzyme'

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
    const component = mount(
      <TaskItem task={baseTask}/>,
    );

    expect(component).toMatchSnapshot();
  });
});