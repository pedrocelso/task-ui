import React, { Component } from 'react';
import { connect } from 'react-redux'
import {isEmpty, isNil, map} from 'ramda'

import { deauthenticate } from '../login/login-actions'
import { TaskService, Task } from '../../services/task';
import { TaskItem } from './task-item'
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
    this.state = {taskList: []}
  }

  componentWillMount() {
    const {service} = this.props
    service.getTasks()
      .fork(
        (e) => {
          if (e.statusCode === 401) {
            this.props.deauthenticate();
            sessionStorage.removeItem(`jwtToken`)
          }
        },
        (taskList) => {
          this.setState({taskList})
        }
      )
  }

  render() {
    const {state} = this
    const {taskList} = state

    const listEl = !isNil(taskList) && !isEmpty(taskList) ? (
      <div className="list-group">
        <div className="list-group-item d-flex row">
          <div className="col-md-7"><h5>Task Details</h5></div>
          <div className="col-md-2"><h5>Created at</h5></div>
          <div className="col-md-2"><h5>Updated at</h5></div>
          <div className="col-md-1"><h5>Inccidents</h5></div>
        </div>
        {map((t) => (<TaskItem task={t} key={t.id}/>), taskList)}
      </div>
    ) : null

    return (
      <div className="panel panel-default">
        {listEl}
      </div>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskList)