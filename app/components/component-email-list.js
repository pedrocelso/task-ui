import React from 'react'
import {usersService} from '../api/api'
import map from 'lodash/fp/map'

class EmailList extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {users: []}
  }
  componentDidMount() {
    const {props} = this
    usersService.getUsers()
    .then((users) => {
      this.setState({users})
    })
  }
  render() {
    const {state} = this
    const {users} = state

    const userList = users ? (
      <div className="list-group">
        {
          map((user) => {
            const {email, name} = user
            return (<a
              href="#"
              className="list-group-item list-group-item-action"
              key={email}
            >
              {name} - {email}
            </a>)
          }, users)
        }
      </div>
    ) : null

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>Users</h4>
        </div>
        {userList}
      </div>
    )
  }
}

export default EmailList
