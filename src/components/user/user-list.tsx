import React, { Component } from 'react';
import {isEmpty, isNil, map} from 'ramda'

import {UserService, User} from '../../services/user'
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

  componentDidMount() {
    const {service} = this.props
    service.getUsers()
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
            return (<div
              className="list-group-item list-group-item-action cursor-pointer"
              key={email}
            >
              {name} - {email}
            </div>)
          }, userList)
        }
      </div>
    ) : null

    return (
      <div className="panel panel-default">
        {listEl}
      </div>
    )
  }
}

export default UserList;
