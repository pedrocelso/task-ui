import dotenv from 'dotenv'
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { startsWith } from 'ramda';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/scss/bootstrap.scss';

import {ApiClient} from './api'
import LoginPage from './components/login-page'
import TaskList from './components/task-list'
import UserList from './components/user-list'
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
  isMenuOpen: boolean;
}

class App extends Component<{},AppState> {
  constructor(props: any) {
    super(props)
    this.state = {isMenuOpen: false}
  }
  componentWillMount() {
    const token = sessionStorage.getItem(`jwtToken`) as string;
    const isLoginPage = () => startsWith(`/login`, document.location.pathname)
    if (!isLoginPage() && !isAuthenticated(token)) {
      redirect(`/login`)()
    }
  }

  render() {
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, sessionStorage.getItem(`jwtToken`) as string);
    const authenticated = isAuthenticated(sessionStorage.getItem(`jwtToken`) as string)

    const routes = authenticated ? [
      (<Route key="Tasks" path="/tasks" render={() =><TaskList service={taskService} />} />),
      (<Route key="Users" path="/users" render={() =><UserList service={userService} />} />)
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

export default App;
