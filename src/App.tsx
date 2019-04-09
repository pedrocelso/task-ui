import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/scss/bootstrap.scss';

import api from './api'
import UserList from './components/user-list'
import { UserService } from './services/user'
import './App.scss';

class App extends Component {
  render() {
    const userService = new UserService(api);
    return (
      <Router>
        <div>
          <Route path="/users" render={() =><UserList service={userService} />} />
        </div>
      </Router>
      
    );
  }
}

export default App;
