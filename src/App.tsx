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

dotenv.config();

const redirect = (path: string) => () => document.location.pathname = path

class App extends Component {
  componentWillMount() {
    const token = sessionStorage.getItem(`jwtToken`);
    const isLoginPage = () => startsWith(`/login`, document.location.pathname)
    if (!isLoginPage() && (!token || token === ``)) {
      redirect(`/login`)()
    }
  }

  render() {
    const api = new ApiClient(process.env.REACT_APP_SERVER_BASE_URL as string, sessionStorage.getItem(`jwtToken`) as string);

    const userService = new UserService(api);
    const taskService = new TaskService(api);
    return (
      <Router>
        <div>
          <Route path="/login" render={() => <LoginPage redirect={redirect(`/users`)}/>} />
          <Route path="/tasks" render={() =><TaskList service={taskService} />} />
          <Route path="/users" render={() =><UserList service={userService} />} />
        </div>
      </Router>
    );
  }
}

export default App;
