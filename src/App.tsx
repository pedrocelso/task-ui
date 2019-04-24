import dotenv from 'dotenv'
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { startsWith } from 'ramda';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/scss/bootstrap.scss';

import {ApiClient} from './api'
import LoginPage from './components/login-page'
import TaskList from './components/task/task-list'
import UserList from './components/user/user-list'
import NavBar from './components/navbar'
import { UserService } from './services/user'
import './App.scss';
import { TaskService } from './services/task';
import {isEmpty, isNil, map} from 'ramda';

dotenv.config();

const redirect = (path: string) => () => document.location.pathname = path
const isAuthenticated = (token: string) => !isNil(token) && !isEmpty(token)
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

interface AppState {
  isUserAuthenticated: boolean;
}

class App extends Component<{},AppState> {
  constructor(props: any) {
    super(props)
    this.state = {isUserAuthenticated: false}
  }

  componentWillMount() {
    const token = sessionStorage.getItem(`jwtToken`) as string;
    const authenticated = isAuthenticated(token)
    const isLoginPage = () => startsWith(`/login`, document.location.pathname)
    if (!isLoginPage() && !authenticated) {
      redirect(`/login`)()
    }
    this.setState({isUserAuthenticated: authenticated})
  }

  render() {
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, sessionStorage.getItem(`jwtToken`) as string);
    const {isUserAuthenticated} = this.state
    const routes = isUserAuthenticated ? [
      (<Route key="Tasks" path="/tasks" render={() =><TaskList service={taskService} />} />),
      (<Route key="Users" path="/users" render={() =><UserList service={userService} />} />),
      (<Route key="Logout" path="/logout" render={() => {
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
          <NavBar authenticated={isUserAuthenticated} />
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

export default App;
