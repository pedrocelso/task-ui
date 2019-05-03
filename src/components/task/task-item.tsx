import React, { Component } from 'react';
import moment from 'moment-timezone'
import { Task } from '../../services/task';

interface TaskItemProps {
  task: Task;
}

export const formatTime = (time: number): string => moment(time).format("YYYY/MM/DD, h:mm:ss a"); 

export class TaskItem extends Component<TaskItemProps> {
  render() {
    const {task} = this.props

    return (
      <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center row">
        <div className="col-md-7">
          <b>{task.name} - {task.description}</b>
        </div>
        <div className="col-md-2">
          {formatTime(task.creationTime)}
        </div>
        <div className="col-md-2">
          {formatTime(task.updateTime)}
        </div>
        <span className="badge badge-primary badge-pill col-md-1">0</span>
      </div>)
  }
}
