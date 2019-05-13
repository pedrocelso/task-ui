import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import './login-page.scss'
import { authenticate } from './login-actions'
import { UserService } from '../../services/user'
import { LinearProgress } from '@material-ui/core';

interface LoginPageProps {
  authenticate: typeof authenticate
  service: UserService;
}

interface LoginPageState {
  email: string
  password: string
  loading: boolean
}

const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (email: string) => emailRegexp.test(email)
const notify = (msg: string, feeling: number) => {
  switch (feeling) {
    case (-1):
      toast.error(msg);
  }
}

export class LoginPage extends Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props)
    this.state = {
      email: ``,
      password: ``,
      loading: false
    }
  }

  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({ email: value })
  }

  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({ password: value })
  }

  login = () => {
    const { authenticate, service } = this.props
    const { email, password } = this.state

    if (isValidEmail(email) && !!password) {
      this.setState({ loading: true })
      service.authenticate({ email, password })
        .fork(
          (e) => {
            this.setState({ loading: false })
            if (e.statusCode === 401) {
              notify(`Wrong email/password!`, -1)
            }
          },
          ({ token }) => {
            this.setState({ loading: false })
            sessionStorage.setItem(`jwtToken`, token)
            authenticate(token)
          }
        )
    } else {
      notify(`Invalid credentials!`, -1)
    }
  }

  render() {
    const { email, loading } = this.state

    const loadingbar = loading ? <LinearProgress variant="indeterminate" /> : null

    return (
      <div id="myModal" className="">
        <div className="loading-bar">
          {loadingbar}
        </div>
        <div className="modal-dialog modal-login">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sign In</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-user"></i></span>
                  <input type="text" className={`form-control ${!isValidEmail(email) ? "is-invalid" : ""}`} name="email" placeholder="E-mail" onChange={this.handleEmailChange} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                  <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handlePasswordChange} />
                </div>
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary btn-block btn-lg" onClick={this.login}>Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = { authenticate }
export default connect(null, mapDispatchToProps)(LoginPage)