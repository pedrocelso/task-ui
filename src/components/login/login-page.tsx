import React, { Component } from 'react';
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import './login-page.scss'
import { authenticate, setEmail, setName } from './login-actions'
import { AppState } from '../../App-store';

interface LoginPageProps {
  authenticate: typeof authenticate
  setEmail: typeof setEmail
  setName: typeof setName
  name: string
  email: string
  redirect: () => void
}

const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (email: string) => emailRegexp.test(email)

export class LoginPage extends Component<LoginPageProps> {
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget
    this.props.setEmail(value)
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget
    this.props.setName(value)
  }

  generateToken = (jwtSecret: string): string => {
    const {email, name} = this.props
    const jwtToken = jwt.sign({email, name}, jwtSecret, {noTimestamp: true})
    return jwtToken;
  }

  redirect = () => {
    const {authenticate, name, email, redirect} = this.props
    if (isValidEmail(email) && !!name) {
      const jwtSecret = process.env.REACT_APP_JWT_SECRET as string
      const token = this.generateToken(jwtSecret);
      sessionStorage.setItem(`jwtToken`, token);
      authenticate(token, name, email);
      redirect();
    }
  }

  render() {
    const {name, email} = this.props
    
    return (
      <div id="myModal" className="">
        <div className="modal-dialog modal-login">
          <div className="modal-content">
            <div className="modal-header">				
              <h4 className="modal-title">Sign In</h4>
            </div>
            <div className="modal-body">
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input type="text" className={`form-control ${!name ? "is-invalid" : ""}`} name="name" placeholder="Name" value={name} onChange={this.handleNameChange} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input type="text" className={`form-control ${!isValidEmail(email) ? "is-invalid" : ""}`} name="email" placeholder="E-mail" value={email} onChange={this.handleEmailChange} />
                  </div>
                </div>
                {/*<div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                    <input type="text" className="form-control" name="password" placeholder="Password" />
                  </div>
                </div>*/}
                <div className="form-group">
                  <button type="button" className="btn btn-primary btn-block btn-lg" onClick={this.redirect}>Sign In</button>
                </div>
            </div>
          </div>
        </div>
      </div>   
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    name: state.login.name,
    email: state.login.email,
  })
}
const mapDispatchToProps = { authenticate, setName, setEmail }
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)