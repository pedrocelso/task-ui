import React from 'react';
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {IncidentPill} from './incident-pill'

const baseTask = {
  id: 123,
  name: `POI quest service`,
  description: `Do A POI quest service`,
  creationTime: 1556924666404,
  updateTime: 1556924566404,
  incidentsCount: 55
}

describe(`<IncidentPill />`, () => {
  it(`Should render the pill with the right incident count`, () => {
    const service = {
      getIncidents: sinon.fake()
    }

    const component = shallow(
      <IncidentPill task={baseTask} service={service} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`Should render the loading icon when service is loading`, () => {
    const service = {
      getIncidents: sinon.fake()
    }

    const component = shallow(
      <IncidentPill task={baseTask} service={service} />,
    );

    component.instance().setState({loading: true})

    expect(component).toMatchSnapshot();
  });
});