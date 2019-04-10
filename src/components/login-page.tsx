import React, { Component } from 'react';
import jwt from 'jsonwebtoken'
import './login-page.scss'
import pathOr from 'ramda/es/pathOr';

interface LoginPageProps {
  redirect: () => void
}

interface LoginPageState {
  name: TextField;
  email: TextField;
}

interface TextField {
  value: string;
  valid?: boolean;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  constructor(props: any) {
    super(props)
    this.state = {
      email: {
        value: ``,
        valid: true
      }, 
      name: {
        value: ``,
        valid: true
      }
    }
  }

  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget
    this.setState({email: {value: e.currentTarget.value, valid: !!value}})
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget
    this.setState({name: {value: e.currentTarget.value, valid: !!value}})
  }

  generateToken = (jwtSecret: string): string => {
    const {state} = this
    const jwtToken = jwt.sign({email: state.email!.value, name: state.name!.value}, jwtSecret, {noTimestamp: true})
    return jwtToken;
  }

  redirect = () => {
    if (this.state.email.valid && this.state.name.valid) {
      const {redirect} = this.props
      const jwtSecret = process.env.REACT_APP_JWT_SECRET as string
      const token = this.generateToken(jwtSecret);
      sessionStorage.setItem(`jwtToken`, token);
      redirect();
    }
  }

  render() {
    return (
      <div id="myModal" className="">
        <div className="modal-dialog modal-login">
          <div className="modal-content">
            <div className="modal-header">				
              <h4 className="modal-title">Sign In</h4>
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input type="text" className={`form-control ${!this.state.name.valid ? "is-invalid" : ""}`} name="name" placeholder="Name" value={this.state.name.value} onChange={this.handleNameChange} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input type="text" className={`form-control ${!this.state.email.valid ? "is-invalid" : ""}`} name="email" placeholder="E-mail" value={this.state.email.value} onChange={this.handleEmailChange} />
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

export default LoginPage;
