import React from 'react';
import {shallow} from 'enzyme'
import sinon from 'sinon'

import { LoginPage } from './login-page'

const baseNotify = sinon.spy()
const baseProps = {
  authenticate: sinon.fake(),
  redirect: sinon.fake(),
  service: {
    authenticate: (_) => ({
      fork: (rej, res) => {
        res({token: `token!`})
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
    const wrapper = shallow(<LoginPage {...props}/>);

    wrapper.instance().handlePasswordChange({currentTarget: {value: `bororoska`}})
    expect(wrapper.state().password).toEqual(`bororoska`)
  });

  it(`.handleEmailChange() - Setting valid email`, () => {
    const props = {
      ...baseProps
    }
    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.instance().handleEmailChange({currentTarget: {value: `bororoska@test.com`}})
    expect(wrapper.state().email).toEqual(`bororoska@test.com`)
  });

  it(`.redirect() - valid state`, () => {
    const redirect = sinon.spy()
    const authenticate = sinon.spy()

    const props = {
      ...baseProps,
      redirect,
      authenticate
    }

    const wrapper = shallow(<LoginPage {...props} />);

    wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

    wrapper.instance().redirect();
    expect(authenticate.called).toBeTruthy();
    expect(redirect.called).toBeTruthy();
  });

  it(`.redirect() - invalid email`, () => {
    const props = {
      ...baseProps,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar', email: 'foo@bar' });

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty email`, () => {
    const props = {
      ...baseProps,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ password: 'bar' });

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });

  it(`.redirect() - empty name`, () => {
    const props = {
      ...baseProps,
      redirect: sinon.spy(),
      authenticate: sinon.spy()
    }

    const wrapper = shallow(<LoginPage {...props} />);
    wrapper.setState({ email: 'foo@bar.com' });

    wrapper.instance().redirect();
    expect(props.redirect.called).toBeFalsy();
    expect(props.authenticate.called).toBeFalsy();
  });

//   it(`.redirect() - 401 response from server`, () => {

//     const props = {
//       ...baseProps,
//       service: {
//         authenticate: (_) => ({
//           fork: (rej, res) => {
//             rej({statusCode: 401})
//           }
//         })
//       }
//     }

//     const notify = (msg, feeling) => {
//       expect(msg).toEqual(`Wrong email/password!`)
//       expect(feeling).toEqual(-1)
//     }

//     const wrapper = shallow(<LoginPage {...props} />);
//     wrapper.setState({ password: 'bar', email: 'foo@bar.com' });

//     wrapper.instance().redirect(notify);
//     expect(props.redirect.called).toBeFalsy();
//     expect(props.authenticate.called).toBeFalsy();
//   });
});