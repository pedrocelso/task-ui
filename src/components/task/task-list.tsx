import React, { Component } from 'react';
import { connect } from 'react-redux'
import { map } from 'ramda'

import { deauthenticate } from '../login/login-actions'
import { TaskService, Task } from '../../services/task';
import TaskItem from './task-item'
import './task-list.scss'

interface TaskProps {
  deauthenticate: typeof deauthenticate
  service: TaskService;
}

interface TaskState {
  taskList: Task[];
}

export class TaskList extends Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = { taskList: [] }
  }

  componentDidMount() {
    const { service } = this.props
    service.getTasks()
      .fork(
        (e) => {
          if (e.statusCode === 401) {
            this.props.deauthenticate();
            sessionStorage.removeItem(`jwtToken`)
          }
        },
        (taskList) => {
          this.setState({ taskList })
        }
      )
  }

  render() {
    const { state } = this
    const { taskList } = state

    return (
      <table className="table">
        <thead className="d-none" id="d-md-table-header-group">
          <tr>
            <th className="d-sm-none d-md-table-cell">Details</th>
            <th className="d-sm-none d-md-table-cell">Created at</th>
            <th className="d-sm-none d-md-table-cell">Updated at</th>
            <th className="d-sm-none d-md-table-cell">Incidents</th>
          </tr>
        </thead>
        <tbody>
          {map((t) => (<TaskItem task={t} key={t.id} service={this.props.service} />), taskList)}
        </tbody>
      </table>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskList)