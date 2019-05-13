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

  it(`.login() - valid state`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<LoginPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

    wrapper.instance().login();
    expect(authenticate.called).toBeTruthy();
  });

  it(`.login() - invalid email`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar' });

    wrapper.instance().login();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.login() - empty email`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar' });

    wrapper.instance().login();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.login() - empty name`, () => {
    const props = {
      ...baseProps,
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ email: 'foo@bar.com' });

    wrapper.instance().login();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.login() - bad response from server`, () => {
    const authenticate = sinon.spy()
    const service = {
      authenticate: (_) => ({
        fork: (rej, res) => {
          rej({ statusCode: 401 })
        }
      })
    }

    const props = {
      ...baseProps,
      service,
      authenticate
    }

    const wrapper = shallow(<LoginPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

    wrapper.instance().login();
    expect(wrapper.state().loading).toBeFalsy()
    expect(authenticate.called).toBeFalsy();
  });
});