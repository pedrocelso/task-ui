import React, { Component } from 'react';
import moment from 'moment-timezone'
import { Task } from '../../services/task';

interface TaskItemProps {
  task: Task;
}

export const formatTime = (time: number): string => {
  const date = new Date(time)
  return time ? moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a") : `n/a`
}

export class TaskItem extends Component<TaskItemProps> {
  render() {
    const {task} = this.props
    const timezone = moment.tz.guess()

    return (
      <React.Fragment>>
        <tr>
          <td className="d-md-none d-table-cell">
            <div className="card">
              <div className="card-body">
                <strong className="card-title">{task.name}</strong>
                <p className="card-text">
                  {task.description}<br />
                  {formatTime(task.creationTime)}<br />
                  {formatTime(task.updateTime)}<br />
                </p>
                <span className="badge badge-primary badge-pill">0</span>
              </div>
            </div>
          </td>
          <td className="d-none d-md-table-cell">{task.name} - {task.description}</td>
          <td className="d-none d-md-table-cell">{formatTime(task.creationTime)}</td>
          <td className="d-none d-md-table-cell">{formatTime(task.updateTime)}</td>
          <td className="d-none d-md-table-cell">
            <span className="badge badge-primary badge-pill">0</span>
          </td>
        </tr>
      </React.Fragment>
    )
  }
}
