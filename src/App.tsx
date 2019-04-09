import React, { Component } from 'react';
import 'bootstrap/scss/bootstrap.scss';

import api from './api'
import UserList from './components/user-list'
import { UserService } from './services/user'
import './App.scss';

class App extends Component {
  render() {
    const userService = new UserService(api);
    return (
      <UserList service={userService} />
    );
  }
}

export default App;
