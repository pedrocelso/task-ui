import React from 'react';
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {IncidentList} from './incident-list'

describe(`<IncidentList />`, () => {
  it(`Should render the list`, () => {
    const incidentList = [
      { id: 10, name: `test`, description: `test@test.com`, creationTime: 1556924666404, updateTime: 1556924566404, status: 0 },
      { id: 11, name: `test1`, description: `test1@test.com`, creationTime: 1556924666404, updateTime: 0, status: 1 },
    ]

    const component = shallow(
      <IncidentList incidentList={incidentList} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should render an empty list`, () => {
    const incidentList = []

    const component = shallow(
      <IncidentList incidentList={incidentList} />,
    );

    expect(component).toMatchSnapshot();
  });

});
