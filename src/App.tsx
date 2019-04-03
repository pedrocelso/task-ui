import React, { Component } from 'react';

import './App.css';
import UserList from './components/user-list'
import {usersService} from './services/users'
import 'bootstrap'

class App extends Component {
  render() {
    return (
      <UserList service={usersService}/>
    );
  }
}

export default App;
