import React, { Component } from 'react';
import {isEmpty, isNil, map} from 'ramda'

import { TaskService, Task } from '../../services/task';
import { TaskItem } from './task-item'
import './task-list.scss'

interface TaskProps {
  service: TaskService;
}

interface TaskState {
  taskList: Task[];
}

class TaskList extends Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = {taskList: []}
  }

  componentWillMount() {
    const {service} = this.props
    service.getTasks()
      .fork(
        () => console.error,
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

export default TaskList;
