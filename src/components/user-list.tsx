import React, { Component } from 'react';
import {isEmpty, isNil, map} from 'ramda'

import api from '../api'
import {UserService, User} from '../services/users'
import './user-list.scss'

interface UserProps {
  service: UserService;
}

interface UserState {
  userList: User[];
}

class UserList extends Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props)
    this.state = {userList: []}
  }

  componentWillMount() {
    this.props.service.getUsers(api)
      .fork(
        () => console.error,
        (userList) => {
          this.setState({userList})
        }
      )
  }

  render() {
    const {state} = this
    const {userList} = state

    const listEl = !isNil(userList) && !isEmpty(userList) ? (
      <div className="list-group">
        {
          map(({email, name}) => {
            return (<a
              href="#"
              className="list-group-item list-group-item-action"
              key={email}
            >
              {name} - {email}
            </a>)
          }, userList)
        }
      </div>
    ) : null

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>Users</h4>
        </div>
        {listEl}
      </div>
    )
  }
}

export default UserList;
