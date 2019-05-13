import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { equals } from 'ramda';
import { LinearProgress, Typography, Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { isValidEmail } from './login-page'
import './login-page.scss'
import { authenticate } from './login-actions'
import { UserService } from '../../services/user'

interface SignUpPageProps {
  authenticate: typeof authenticate
  service: UserService;
}

interface SignUpPageState {
  email: string
  name: string
  password: string
  passwordConfirmation: string
  loading: boolean
}

const notify = (msg: string, feeling: number) => {
  switch (feeling) {
    case (-1):
      toast.error(msg);
  }
}

export class SignUpPage extends Component<SignUpPageProps, SignUpPageState> {
  constructor(props: SignUpPageProps) {
    super(props)
    this.state = {
      email: ``,
      name: ``,
      password: ``,
      passwordConfirmation: ``,
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

  handlePasswordConfirmationChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({ passwordConfirmation: value })
  }

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({ name: value })
  }

  validateForm = () => {
    const { email, password, passwordConfirmation, name } = this.state

    if (!isValidEmail(email)) {
      return false
    }

    if (!name || !password) {
      return false
    }

    if (!equals(password, passwordConfirmation)) {
      return false
    }

    return true
  }

  signUp = () => {
    const { service } = this.props
    const { email, password, passwordConfirmation, name } = this.state

    if (isValidEmail(email) && !!name && equals(password, passwordConfirmation)) {
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

    const validData = this.validateForm()

    const loadingbar = loading ? <LinearProgress variant="indeterminate" /> : null

    return (
      <div className="modal__dialog">
        <Grid container className="modal__grid" alignContent="center" spacing={16} direction="column">
          {loadingbar}
          <Grid item xs={10} container alignContent="center" direction="column">
            <Typography variant="h4">Sign Up</Typography>
          </Grid>
          <Grid item xs={10} container direction="row">
            <input type="text" className="form-control" name="name" placeholder="Name" onChange={this.handleNameChange} />
          </Grid>
          <Grid item xs={10} container direction="row">
            <input type="text" className={`form-control ${!isValidEmail(email) ? "is-invalid" : ""}`} name="email" placeholder="E-mail" onChange={this.handleEmailChange} />
          </Grid>
          <Grid item xs={10} container direction="row">
            <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handlePasswordChange} />
          </Grid>
          <Grid item xs={10} container direction="row">
            <input type="password" className="form-control" name="passwordConfirmation" placeholder="Confirm Password" onChange={this.handlePasswordConfirmationChange} />
          </Grid>
          <Grid item xs={10} container direction="column">
            <Button disabled={!validData} variant="contained" color="primary" onClick={this.signUp} className="btnSignUp">
              Sign Up
            </Button>
          </Grid>
          <Grid item xs={10} container alignContent="center" direction="column">
            <Typography>Don't have an account? <Link to="/signup">Click here</Link></Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapDispatchToProps = { authenticate }
export default connect(null, mapDispatchToProps)(SignUpPage)