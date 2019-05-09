import React from 'react';
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { LoginPage } from './login-page'

const baseProps = {
  authenticate: sinon.fake(),
  service: {
    authenticate: (_) => ({
      fork: (rej, res) => {
        res({ token: `token!` })
      }
    })
  }
}

describe(`<LoginPage />`, () => {
  it(`Should render without errors`, () => {
    const component = shallow(
      <LoginPage {...baseProps} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.handlePasswordChange() - Setting valid name`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<LoginPage {...props} />);

    wrapper.instance().handlePasswordChange({ currentTarget: { value: `bororoska` } })
    expect(wrapper.state().password).toEqual(`bororoska`)
  });

  it(`.handleEmailChange() - Setting valid email`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.instance().handleEmailChange({ currentTarget: { value: `bororoska@test.com` } })
    expect(wrapper.state().email).toEqual(`bororoska@test.com`)
  });

  it(`.redirect() - valid state`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<LoginPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

    wrapper.instance().redirect();
    expect(authenticate.called).toBeTruthy();
  });

  it(`.redirect() - invalid email`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar' });

    wrapper.instance().redirect();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty email`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar' });

    wrapper.instance().redirect();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty name`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ email: 'foo@bar.com' });

    wrapper.instance().redirect();
    expect(props.authenticate.called).toBeFalsy();
  });
});