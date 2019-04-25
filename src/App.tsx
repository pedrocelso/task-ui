import dotenv from 'dotenv'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { pathOr, startsWith } from 'ramda';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwt from 'jsonwebtoken'

import { AppState } from './App-store'
import {ApiClient} from './api'
import LoginPage from './components/login/login-page'
import { authenticate, deauthenticate } from './components/login/login-actions'
import TaskList from './components/task/task-list'
import UserList from './components/user/user-list'
import NavBar from './components/navbar'
import { UserService } from './services/user'
import './App.scss';
import { TaskService } from './services/task';
import {isEmpty, isNil, map} from 'ramda';
import { LoginState } from './components/login/login-types';

import 'bootstrap/scss/bootstrap.scss';

dotenv.config();

const redirect = (path: string) => () => document.location.pathname = path
const isValidToken = (token: string) => !isNil(token) && !isEmpty(token)
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#428e92',
      main: '#006064',
      dark: '#00363a',
      contrastText: '#ffffff',
    },
  },
  typography: {
    useNextVariants: true,
  }
});

interface AppProps {
  authenticate: typeof authenticate
  deauthenticate: typeof deauthenticate
  login: LoginState
}

class App extends Component<AppProps> {
  componentWillMount() {
    if (!this.props.login.authenticated) {
      const token = sessionStorage.getItem(`jwtToken`) as string;
  
      if (isValidToken(token)) {
        const jwtSecret = process.env.REACT_APP_JWT_SECRET as string
        const decodedJwt = jwt.verify(token, jwtSecret)
        const email = pathOr(``, [`email`], decodedJwt)
        const name = pathOr(``, [`name`], decodedJwt)
        this.props.authenticate(token, name, email)
      }

    }
  }

  render() {
    const {authenticated, token} = this.props.login
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, token);
    const userService = new UserService(api);
    const taskService = new TaskService(api);
    
    const privateRoutes = [
      (<Route key="Tasks" path="/tasks" render={() =><TaskList service={taskService} />} />),
      (<Route key="Users" path="/users" render={() =><UserList service={userService} />} />),
      (<Route key="Logout" path="/logout" render={() => {
        this.props.deauthenticate();
        sessionStorage.removeItem(`jwtToken`)
        this.setState({isUserAuthenticated: false})
        return (
          <Typography variant="h6" color="inherit">
            You have been logged out
          </Typography>
        )
      }} />)
    ]

    const content = authenticated ? (
      <div>
        {
          map((r: JSX.Element) => r, privateRoutes)
        }
      </div>
    ) : <LoginPage redirect={redirect(`/tasks`)}/>

    return (
      <div>
        <MuiThemeProvider theme={muiTheme}>
          <Router>
            <NavBar />
            {content}
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  login: state.login
})
const mapDispatchToProps = { authenticate, deauthenticate }
export default connect(mapStateToProps, mapDispatchToProps)(App)
