import React from 'react';
import {mount, shallow} from 'enzyme'
import sinon from 'sinon'

import LoginPage from './login-page'

describe(`<LoginPage />`, () => {
  it(`Should render without errors`, () => {
    const component = shallow(
      <LoginPage />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.generateToken()`, () => {
    const component = mount(<LoginPage redirect={sinon.fake()}/>);
    component.setState({name: `test`, email: `test@test.com`})
    const token = component.instance().generateToken(`teste`);

    expect(token).toEqual(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`)
  });

  it(`.handleNameChange()`, () => {
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().name).toEqual(``);

    wrapper.instance().handleNameChange({currentTarget: {value: `bororoska`}})
    expect(wrapper.state().name).toEqual(`bororoska`);
  });

  it(`.handleEmailChange()`, () => {
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().email).toEqual(``);

    wrapper.instance().handleEmailChange({currentTarget: {value: `bororoska@test.com`}})
    expect(wrapper.state().email).toEqual(`bororoska@test.com`);
  });

  it(`.redirect()`, () => {
    expect.assertions(1);
    var callback = sinon.spy();
    const wrapper = mount(<LoginPage redirect={callback}/>);
    wrapper.setState({name: `test`, email: `test@test.com`})

    wrapper.instance().redirect();
    expect(callback.called).toBeTruthy();
  });
});