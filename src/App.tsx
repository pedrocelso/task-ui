import dotenv from 'dotenv'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { startsWith } from 'ramda';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/scss/bootstrap.scss';

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
    const token = sessionStorage.getItem(`jwtToken`) as string;
    const validToken = isValidToken(token)
    const isLoginPage = () => startsWith(`/login`, document.location.pathname)
    if (!isLoginPage() && !validToken) {
      redirect(`/login`)()
    } else if (validToken) {
      this.props.authenticate()
    }
  }

  render() {
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, sessionStorage.getItem(`jwtToken`) as string);
    const {authenticated} = this.props.login
    const routes = authenticated ? [
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
    ] : [(<Route key="Login" path="/" render={() => <LoginPage redirect={redirect(`/tasks`)}/>} />)]

    const userService = new UserService(api);
    const taskService = new TaskService(api);
    return (
      <div>
        <MuiThemeProvider theme={muiTheme}>
          <Router>
            <NavBar authenticated={authenticated} />
            <div>
              {
                map((r: JSX.Element) => r, routes)
              }
            </div>
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
