import React from 'react';
import {mount, shallow} from 'enzyme'
import sinon from 'sinon'

import { LoginPage } from './login-page'

const baseProps = {
  authenticate: sinon.fake(),
  setEmail: sinon.fake(),
  setName: sinon.fake(),
  name: `test`,
  email: `test@test.com`,
  redirect: sinon.fake()
}

describe(`<LoginPage />`, () => {
  it(`Should render without errors`, () => {
    const component = shallow(
      <LoginPage {...baseProps} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.generateToken()`, () => {
    const component = mount(<LoginPage {...baseProps} />);
    const token = component.instance().generateToken(`teste`);

    expect(token).toEqual(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoidGVzdCJ9.reAIlQy61UD_OK3dNTvhJOtWi4WApQ1lSPrV1p1fk1o`)
  });

  it(`.handleNameChange() - Setting valid name`, () => {
    expect.assertions(1);
    const props = {
      ...baseProps,
      setName: (name) => expect(name).toEqual(`bororoska`)
    }
    const wrapper = mount(<LoginPage {...props}/>);

    wrapper.instance().handleNameChange({currentTarget: {value: `bororoska`}})
  });

  it(`.handleEmailChange() - Setting valid email`, () => {
    expect.assertions(1);
    const props = {
      ...baseProps,
      setEmail: (email) => expect(email).toEqual(`bororoska@test.com`)
    }
    const wrapper = mount(<LoginPage {...props} />);
    wrapper.instance().handleEmailChange({currentTarget: {value: `bororoska@test.com`}})
  });

  it(`.redirect() - valid state`, () => {
    expect.assertions(2);

    const redirect = sinon.spy()
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      redirect,
      authenticate
    }

    const wrapper = mount(<LoginPage {...props} />);

    wrapper.instance().redirect();
    expect(authenticate.called).toBeTruthy();
    expect(redirect.called).toBeTruthy();
  });

  it(`.redirect() - invalid email`, () => {
    expect.assertions(2);

    const props = {
      ...baseProps,
      email: `wrong`,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = mount(<LoginPage {...props} />);

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty email`, () => {
    expect.assertions(2);

    const props = {
      ...baseProps,
      email: ``,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = mount(<LoginPage {...props} />);

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty name`, () => {
    expect.assertions(2);

    const props = {
      ...baseProps,
      name: ``,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = mount(<LoginPage {...props} />);

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });
});