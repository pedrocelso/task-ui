import React, { Component } from 'react';
import moment from 'moment-timezone'
import { Task } from '../../services/task';

interface TaskItemProps {
  task: Task;
}

export const formatTime = (time: number): string => {
  const date = new Date(time)
  return moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a")
}

export class TaskItem extends Component<TaskItemProps> {
  render() {
    const {task} = this.props
    const timezone = moment.tz.guess()

    return (
      <div className="list-group-item d-flex row">
        <div className="col-md-7">
          <b>{task.name} - {task.description}</b>
        </div>
        <div className="col-md-2">
          {formatTime(task.creationTime)}
        </div>
        <div className="col-md-2">
          {formatTime(task.updateTime)}
        </div>
        <div className="col-md-1">
          <span className="badge badge-primary badge-pill">0</span>
        </div>
      </div>
    )
  }
}
