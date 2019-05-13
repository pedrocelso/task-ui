import React from 'react';
import { shallow } from 'enzyme'

import { SignUpPage } from './signup-page'

const baseProps = {
  service: {
    createUser: (_) => ({
      fork: (rej, res) => {
        res({user: {name: `Foo`, email: `foo@bar.com`}})
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
    const wrapper = shallow(<SignUpPage {...baseProps} />);

    wrapper.instance().handlePasswordChange({ currentTarget: { value: `bororoska` } })
    expect(wrapper.state().password).toEqual(`bororoska`)
  });

  it(`.handleEmailChange() - Setting valid email`, () => {
    const wrapper = shallow(<SignUpPage {...baseProps} />);
    wrapper.instance().handleEmailChange({ currentTarget: { value: `bororoska@test.com` } })
    expect(wrapper.state().email).toEqual(`bororoska@test.com`)
  });

  it(`.handlePasswordConfirmationChange() - Setting valid password confirmation`, () => {
    const wrapper = shallow(<SignUpPage {...baseProps} />);
    wrapper.instance().handlePasswordConfirmationChange({ currentTarget: { value: `bororoska` } })
    expect(wrapper.state().passwordConfirmation).toEqual(`bororoska`)
  });

  it(`.handleNameChange() - Setting valid name`, () => {
    const wrapper = shallow(<SignUpPage {...baseProps} />);
    wrapper.instance().handleNameChange({ currentTarget: { value: `Agric Malmim` } })
    expect(wrapper.state().name).toEqual(`Agric Malmim`)
  });

  it(`.signUp() - valid response`, () => {
    const wrapper = shallow(<SignUpPage {...baseProps} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });
    wrapper.instance().signUp();
    
    expect(wrapper.state().loading).toBeFalsy()
  });

  it(`.signUp() - 401 response`, () => {
    const props = {
      service: {
        createUser: (_) => ({
          fork: (rej, res) => {
            rej({ statusCode: 401 })
          }
        })
      }
    }

    const wrapper = shallow(<SignUpPage {...props} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });
    wrapper.instance().signUp();
    
    expect(wrapper.state().loading).toBeFalsy()
  });

  it(`.signUp() - 500 response`, () => {
    const props = {
      service: {
        createUser: (_) => ({
          fork: (rej, res) => {
            rej({ statusCode: 500 })
          }
        })
      }
    }

    const wrapper = shallow(<SignUpPage {...props} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });
    wrapper.instance().signUp();
    
    expect(wrapper.state().loading).toBeFalsy()
  });

  it(`.validateForm() - valid state`, () => {

    const wrapper = shallow(<SignUpPage {...baseProps} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeTruthy();
  });

  it(`.validateForm() - invalid email`, () => {

    const wrapper = shallow(<SignUpPage {...baseProps} />);
    wrapper.setState({ password: 'bar', email: 'foobar.com', name: `Foo`, passwordConfirmation: `bar` });
    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - empty name`, () => {

    const wrapper = shallow(<SignUpPage {...baseProps} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - empty password`, () => {

    const wrapper = shallow(<SignUpPage {...baseProps} />);

    wrapper.setState({ password: '', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });

  it(`.validateForm() - password not matching confirmation`, () => {

    const wrapper = shallow(<SignUpPage {...baseProps} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com', name: `Foo`, passwordConfirmation: `bar1` });

    expect(wrapper.instance().validateForm()).toBeFalsy();
  });
});