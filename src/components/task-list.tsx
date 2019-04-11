import React, { Component } from 'react';
import {isEmpty, isNil, map} from 'ramda'

import { TaskService, Task } from '../services/task';
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
        {
          map(({id, name, description}) => {
            return (<a
              href="#"
              className="list-group-item list-group-item-action"
              key={id}
            >
              {name} - {description}
            </a>)
          }, taskList)
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

export default TaskList;
