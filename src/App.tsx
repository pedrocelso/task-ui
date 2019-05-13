import dotenv from 'dotenv'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Lock, LockOpen, People, PersonAdd, Storage } from "@material-ui/icons";
import { Paper } from '@material-ui/core';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import { AppState } from './App-store'
import { ApiClient } from './api'
import LoginPage from './components/login/login-page'
import SignupPage from './components/login/signup-page'
import { authenticate, deauthenticate } from './components/login/login-actions'
import TaskList from './components/task/task-list'
import UserList from './components/user/user-list'
import { Item, NavBar } from './components/navbar'
import { UserService } from './services/user'
import './App.scss';
import { TaskService } from './services/task';
import { isEmpty, isNil, map, reject } from 'ramda';
import { LoginState } from './components/login/login-types';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/scss/bootstrap.scss';

dotenv.config();

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
  componentDidMount() {
    if (!this.props.login.authenticated) {
      const token = sessionStorage.getItem(`jwtToken`) as string;
      if (isValidToken(token)) {
        this.props.authenticate(token)
      }
    }
  }

  render() {
    const { authenticated, token } = this.props.login
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, token);
    const userService = new UserService(api);
    const taskService = new TaskService(api);

    const paperWrapper = (el: JSX.Element): JSX.Element => (
      <Paper className="paper-content" elevation={0}>
        {el}
      </Paper>
    )

    const menuItems: Item[] = [
      { title: `Sign Up`, path: `/signup`, icon: (<PersonAdd color="primary" />), private: false, route: (<Route key="Signup" path="/signup" render={() => paperWrapper(<SignupPage service={userService} />)} />) },
      { title: `Login`, path: `/`, icon: (<Lock color="primary" />), private: false, route: (<Route exact key="Login" path="/" render={() => paperWrapper(<LoginPage service={userService} />)} />) },
      { title: `Users`, path: `/users`, icon: (<People color="primary" />), private: true, route: (<Route key="Users" path="/users" render={() => paperWrapper(<UserList service={userService} />)} />) },
      { title: `Tasks`, path: `/tasks`, icon: (<Storage color="primary" />), private: true, route: (<Route key="Tasks" path="/tasks" render={() => paperWrapper(<TaskList service={taskService} />)} />) },
      {
        title: `Logout`, path: `/logout`, icon: (<LockOpen color="primary" />), private: true, route: (<Route key="Logout" path="/logout" render={() => {
          this.props.deauthenticate();
          sessionStorage.removeItem(`jwtToken`)
          return (
            <Redirect to="/" />
          )
        }} />)
      }
    ]

    const rejectRoutes = (i: Item) => authenticated ? !i.private : i.private

    const filteredRoutes = reject(rejectRoutes, menuItems)

    const content = (
      <div className="content">
        {
          map((i) => i.route, filteredRoutes)
        }
      </div>
    )

    return (
      <div>
        <MuiThemeProvider theme={muiTheme}>
          <Router>
            <NavBar items={filteredRoutes} />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              draggable
              pauseOnHover
            />
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
