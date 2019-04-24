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
    component.setState({name: {value: `test`, valid: true}, email: {value: `test@test.com`, valid: true}})
    const token = component.instance().generateToken(`teste`);

    expect(token).toEqual(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`)
  });

  it(`.handleNameChange() - Setting valid name (not empty value)`, () => {
    expect.assertions(4);
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().name.value).toEqual(``);
    expect(wrapper.state().name.valid).toBeTruthy();

    wrapper.instance().handleNameChange({currentTarget: {value: `bororoska`}})
    expect(wrapper.state().name.value).toEqual(`bororoska`);
    expect(wrapper.state().name.valid).toBeTruthy();
  });

  it(`.handleNameChange() - Setting invalid name (empty string)`, () => {
    expect.assertions(4);
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().name.value).toEqual(``);
    expect(wrapper.state().name.valid).toBeTruthy();

    wrapper.instance().handleNameChange({currentTarget: {value: ``}})
    expect(wrapper.state().name.value).toEqual(``);
    expect(wrapper.state().name.valid).toBeFalsy();
  });

  it(`.handleEmailChange() - Setting valid email (not empty value)`, () => {
    expect.assertions(4);
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().email.value).toEqual(``);
    expect(wrapper.state().email.valid).toBeTruthy();

    wrapper.instance().handleEmailChange({currentTarget: {value: `bororoska@test.com`}})
    expect(wrapper.state().email.value).toEqual(`bororoska@test.com`);
    expect(wrapper.state().email.valid).toBeTruthy();
  });

  it(`.handleEmailChange() - Setting invalid email (empty string)`, () => {
    expect.assertions(4);
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().email.value).toEqual(``);
    expect(wrapper.state().email.valid).toBeTruthy();

    wrapper.instance().handleEmailChange({currentTarget: {value: ``}})
    expect(wrapper.state().email.value).toEqual(``);
    expect(wrapper.state().email.valid).toBeFalsy();
  });

  it(`.handleEmailChange() - Setting invalid email (invalid string)`, () => {
    expect.assertions(4);
    const wrapper = mount(<LoginPage redirect={sinon.fake()}/>);
    expect(wrapper.state().email.value).toEqual(``);
    expect(wrapper.state().email.valid).toBeTruthy();

    wrapper.instance().handleEmailChange({currentTarget: {value: `test`}})
    expect(wrapper.state().email.value).toEqual(`test`);
    expect(wrapper.state().email.valid).toBeFalsy();
  });

  it(`.redirect() - valid state`, () => {
    expect.assertions(1);
    var callback = sinon.spy();
    const wrapper = mount(<LoginPage redirect={callback}/>);
    wrapper.setState({name: {value: `test`, valid: true}, email: {value: `test@test.com`, valid: true}})

    wrapper.instance().redirect();
    expect(callback.called).toBeTruthy();
  });

  it(`.redirect() - invalid state`, () => {
    expect.assertions(1);
    var callback = sinon.spy();
    const wrapper = mount(<LoginPage redirect={callback}/>);
    wrapper.setState({name: {value: `test`, valid: true}, email: {value: ``, valid: false}})

    wrapper.instance().redirect();
    expect(callback.called).toBeFalsy();
  });
});