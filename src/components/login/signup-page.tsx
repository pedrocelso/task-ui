import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { equals } from 'ramda';
import { LinearProgress, Typography, Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { isValidEmail } from './login-page'
import './login-page.scss'
import { UserService } from '../../services/user'

interface SignUpPageProps {
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
      break;
    case (1):
      toast.success(msg);
      break;
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
    const { email, password, name } = this.state

    this.setState({ loading: true })
    service.createUser({name, email, password})
    .fork(
      (e) => {
        this.setState({ loading: false })
        if (e.statusCode === 401) {
          notify(`Wrong email/password!`, -1)
        } else {
          console.error(e)
          notify(`An error has occured. Please try again later.`, -1)
        }
      },
      ({user}) => {
        this.setState({ loading: false })
        notify(`User ${user.email} created!`, 1)
      }
    )
  }

  render() {
    const { email, loading } = this.state

    const validData = this.validateForm()

    const loadingbar = loading ? <LinearProgress className="loading-bar" variant="indeterminate" /> : null

    return (
      <div>
        {loadingbar}
        <div className="modal__dialog">
          <Grid container className="modal__grid" alignContent="center" spacing={16} direction="column">
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
              <Typography>Already registered? <Link to="/">Click here</Link></Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
