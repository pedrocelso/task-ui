import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { LinearProgress, Typography, Grid, Button, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom'
import './login-page.scss'
import { authenticate } from './login-actions'
import { UserService } from '../../services/user'

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
export const isValidEmail = (email: string) => emailRegexp.test(email)
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

    const loadingbar = loading ? <LinearProgress className="loading-bar" variant="indeterminate" /> : null

    return (
      <Paper id="login" elevation={0}>
        <div className="loading-bar">{loadingbar}</div>
        <div className="modal__dialog">
          <Grid container className="modal__grid" alignContent="center" spacing={16} direction="column">
            <Grid item xs={10} container alignContent="center" direction="column">
              <Typography variant="h4">Sign In</Typography>
            </Grid>
            <Grid item xs={10} container direction="row">
              <input type="text" className={`form-control ${!isValidEmail(email) ? "is-invalid" : ""}`} name="email" placeholder="E-mail" onChange={this.handleEmailChange} />
            </Grid>
            <Grid item xs={10} container direction="row">
              <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handlePasswordChange} />
            </Grid>
            <Grid item xs={10} container direction="column">
              <Button variant="contained" color="primary" onClick={this.login} className="btnLogin">
                Sign In
              </Button>
            </Grid>
            <Grid item xs={10} container alignContent="center" direction="column">
              <Typography>Don't have an account? <Link to="/signup">Click here</Link></Typography>
            </Grid>
          </Grid>
        </div>
      </Paper>
    )
  }
}

const mapDispatchToProps = { authenticate }
export default connect(null, mapDispatchToProps)(LoginPage)