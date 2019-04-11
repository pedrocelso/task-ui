import React from 'react';
import {mount, shallow} from 'enzyme'
import sinon from 'sinon'

import NavBar from './navbar'

describe(`<NavBar />`, () => {
  it(`Should render without errors`, () => {
    const component = shallow(<NavBar redirect={sinon.fake()} />);

    expect(component).toMatchSnapshot();
  });

  it(`.getTitle() - Should return the right title based on the document location`, () => {
    expect.assertions(2);
    const component = mount(<NavBar redirect={sinon.fake()} />);;

    expect(component.instance().getTitle(`/users`)).toEqual(`Users`)
    expect(component.instance().getTitle(`/tasks`)).toEqual(`Tasks`)
  });

  it(`.getTitle() - Should return an empty string for unknow locations`, () => {
    expect.assertions(1);
    const component = mount(<NavBar redirect={sinon.fake()} />);;

    expect(component.instance().getTitle(`/gerere`)).toEqual(``)
  });

  it(`.toggleDrawer() - Should set the right parameter for the drawer menu`, () => {
    const component = mount(<NavBar redirect={sinon.fake()} />);;
    expect(component.state().drawerOpened).toBeFalsy();
    component.instance().toggleDrawer(true)();
    expect(component.state().drawerOpened).toBeTruthy();
    component.instance().toggleDrawer(false)();
    expect(component.state().drawerOpened).toBeFalsy();
  });
});