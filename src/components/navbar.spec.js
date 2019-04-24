import React from 'react';
import {mount, shallow} from 'enzyme'

import NavBar from './navbar'

const context = { router: { isActive: (a, b) => true } };

describe(`<NavBar />`, () => {
  it(`Should render without errors for authenticated users`, () => {
    const component = shallow(<NavBar authenticated={true} />, {context}, {context});

    expect(component).toMatchSnapshot();
  });

  it(`Should render without errors for unauthenticated users`, () => {
    const component = shallow(<NavBar authenticated={false} />, {context});

    expect(component).toMatchSnapshot();
  });

  it(`.getTitle() - Should return the right title based on the document location`, () => {
    expect.assertions(2);
    const component = mount(<NavBar authenticated={true} />, {context});;

    expect(component.instance().getTitle(`/users`)).toEqual(`Users`)
    expect(component.instance().getTitle(`/tasks`)).toEqual(`Tasks`)
  });

  it(`.getTitle() - Should return an empty string for unknow locations`, () => {
    expect.assertions(1);
    const component = mount(<NavBar authenticated={true} />, {context});;

    expect(component.instance().getTitle(`/gerere`)).toEqual(``)
  });

  it(`.toggleDrawer() - Should set the right parameter for the drawer menu`, () => {
    const component = shallow(<NavBar authenticated={true} />, {context});
    expect(component.state().drawerOpened).toBeFalsy();
    component.instance().toggleDrawer(true)();
    expect(component.state().drawerOpened).toBeTruthy();
    component.instance().toggleDrawer(false)();
    expect(component.state().drawerOpened).toBeFalsy();
  });

  it(`.getMenuItems() - Should return menu items according to the user authentication`, () => {
    expect.assertions(10);
    const component1 = mount(<NavBar authenticated={true} />, {context});
    const authenticatedItems = component1.instance().getMenuItems();
    expect(authenticatedItems.length).toEqual(3);
    expect(authenticatedItems[0].title).toEqual(`Users`);
    expect(authenticatedItems[0].path).toEqual(`/users`);
    expect(authenticatedItems[1].title).toEqual(`Tasks`);
    expect(authenticatedItems[1].path).toEqual(`/tasks`);
    expect(authenticatedItems[2].title).toEqual(`Logout`);
    expect(authenticatedItems[2].path).toEqual(`/logout`);

    const component2 = mount(<NavBar authenticated={false} />, {context});
    const unauthenticatedItems = component2.instance().getMenuItems();
    expect(unauthenticatedItems.length).toEqual(1);
    expect(unauthenticatedItems[0].title).toEqual(`Login`);
    expect(unauthenticatedItems[0].path).toEqual(`/login`);
  });
});