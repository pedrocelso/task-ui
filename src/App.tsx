import dotenv from 'dotenv'
import React, { Component } from 'react';
import { startsWith } from 'ramda';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/scss/bootstrap.scss';

import {ApiClient} from './api'
import LoginPage from './components/login-page'
import TaskList from './components/task-list'
import UserList from './components/user-list'
import { UserService } from './services/user'
import './App.scss';
import { TaskService } from './services/task';
import {isEmpty, isNil, map} from 'ramda';

dotenv.config();

const redirect = (path: string) => () => document.location.pathname = path
const isAuthenticated = (token: string) => !isNil(token) && !isEmpty(token)

class App extends Component {
  componentWillMount() {
    const token = sessionStorage.getItem(`jwtToken`) as string;
    const isLoginPage = () => startsWith(`/login`, document.location.pathname)
    if (!isLoginPage() && !isAuthenticated(token)) {
      redirect(`/login`)()
    }
  }

  render() {
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, sessionStorage.getItem(`jwtToken`) as string);

    const routes = isAuthenticated(sessionStorage.getItem(`jwtToken`) as string) ? [
      (<Route path="/tasks" render={() =><TaskList service={taskService} />} />),
      (<Route path="/users" render={() =><UserList service={userService} />} />)
    ] : [(<Route path="/" render={() => <LoginPage redirect={redirect(`/tasks`)}/>} />)]

    const userService = new UserService(api);
    const taskService = new TaskService(api);
    return (
      <Router>
        <div>
          {
            map((r: JSX.Element) => r, routes)
          }
        </div>
      </Router>
    );
  }
}

export default App;
