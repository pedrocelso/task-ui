import React from 'react';
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { SignUpPage } from './signup-page'

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

describe(`<SignUpPage />`, () => {
  it(`Should render without errors`, () => {
    const component = shallow(
      <SignUpPage {...baseProps} />,
    );

    expect(component).toMatchSnapshot();
  });

  it(`.handlePasswordChange() - Setting valid name`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.instance().handlePasswordChange({ currentTarget: { value: `bororoska` } })
    expect(wrapper.state().password).toEqual(`bororoska`)
  });

  it(`.handleEmailChange() - Setting valid email`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<SignUpPage {...props} />);
    wrapper.instance().handleEmailChange({ currentTarget: { value: `bororoska@test.com` } })
    expect(wrapper.state().email).toEqual(`bororoska@test.com`)
  });

  it(`.handlePasswordConfirmationChange() - Setting valid password confirmation`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<SignUpPage {...props} />);
    wrapper.instance().handlePasswordConfirmationChange({ currentTarget: { value: `bororoska` } })
    expect(wrapper.state().passwordConfirmation).toEqual(`bororoska`)
  });

  it(`.handleNameChange() - Setting valid name`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<SignUpPage {...props} />);
    wrapper.instance().handleNameChange({ currentTarget: { value: `Agric Malmim` } })
    expect(wrapper.state().name).toEqual(`Agric Malmim`)
  });

  it(`.signUp() - valid state`, () => {
    // const authenticate = sinon.spy()

    // const props = {
    //   ...baseProps,
    //   authenticate
    // }

    // const wrapper = shallow(<SignUpPage {...props} />);

    // wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

    // wrapper.instance().login();
    // expect(authenticate.called).toBeTruthy();
  });

  it(`.validateForm() - valid state`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeTruthy();
  });

  it(`.validateForm() - invalid email`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foobar.com', name: `Foo`, passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - empty name`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - empty password`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.setState({ password: '', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - password not matching confirmation`, () => {
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      authenticate
    }

    const wrapper = shallow(<SignUpPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar1` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });
});