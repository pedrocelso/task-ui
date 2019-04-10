import React, { Component } from 'react';
import jwt from 'jsonwebtoken'
import './login-page.scss'

interface LoginPageProps {
  redirect: () => void
}

interface LoginPageState {
  name?: string;
  email?: string;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  constructor(props: any) {
    super(props)
    this.state = {email: ``, name: ``}
  }

  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({email: e.currentTarget.value})
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({name: e.currentTarget.value})
  }

  generateToken = (jwtSecret: string): string => {
    const {state} = this
    const jwtToken = jwt.sign({email: state.email, name: state.name}, jwtSecret, {noTimestamp: true})
    return jwtToken;
  }

  redirect = () => {
    const {redirect} = this.props
    const jwtSecret = process.env.REACT_APP_JWT_SECRET as string
    const token = this.generateToken(jwtSecret);
    sessionStorage.setItem(`jwtToken`, token);
    redirect();
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
                    <input type="text" className="form-control" name="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                    <input type="text" className="form-control" name="email" placeholder="E-mail" value={this.state.email} onChange={this.handleEmailChange} />
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
