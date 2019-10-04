import React from 'react';
import { mount, shallow } from 'enzyme'
import { Lock, LockOpen, People, Storage } from "@material-ui/icons";

import { NavBar } from './navbar'

const context = { router: { isActive: (a, b) => true } };

const privateItems = [
  { title: `Users`, path: `/users`, icon: (<People color="primary" />), private: true, route: null },
  { title: `Tasks`, path: `/tasks`, icon: (<Storage color="primary" />), private: true, route: null },
  { title: `Logout`, path: `/logout`, icon: (<LockOpen color="primary" />), private: true, route: null }
]

const publicItems = [
  { title: `Login`, path: `/`, icon: (<Lock color="primary" />), private: false, route: null }
]

describe(`<NavBar />`, () => {
  it(`Should render without errors for authenticated users`, () => {
    const component = shallow(<NavBar items={privateItems} />, { context }, { context });

    expect(component).toMatchSnapshot();
  });

  it(`Should render without errors for unauthenticated users`, () => {
    const component = shallow(<NavBar items={publicItems} />, { context });

    expect(component).toMatchSnapshot();
  });

  it(`.getTitle() - Should return the right title based on the document location`, () => {
    expect.assertions(2);
    const component = mount(<NavBar items={privateItems} />, { context });;

    expect(component.instance().getTitle(`/users`)).toEqual(`Users`)
    expect(component.instance().getTitle(`/tasks`)).toEqual(`Tasks`)
  });

  it(`.getTitle() - Should return an empty string for unknow locations`, () => {
    expect.assertions(1);
    const component = mount(<NavBar items={privateItems} />, { context });;

    expect(component.instance().getTitle(`/gerere`)).toEqual(``)
  });

  it(`.toggleDrawer() - Should set the right parameter for the drawer menu`, () => {
    const component = shallow(<NavBar items={publicItems} />, { context });
    expect(component.state().drawerOpened).toBeFalsy();
    component.instance().toggleDrawer(true)();
    expect(component.state().drawerOpened).toBeTruthy();
    component.instance().toggleDrawer(false)();
    expect(component.state().drawerOpened).toBeFalsy();
  });

});
