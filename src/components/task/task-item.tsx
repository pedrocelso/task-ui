import React, { Component } from 'react';
import moment from 'moment-timezone'
import { Task, TaskService } from '../../services/task';
import IncidentPill from '../incident/incident-pill';

interface TaskItemProps {
  task: Task;
  service: TaskService;
}

export const formatTime = (time: number): string => {
  const date = new Date(time)
  return time ? moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a") : `n/a`
}

export class TaskItem extends Component<TaskItemProps> {
  render() {
    const {service, task} = this.props
    const badgePill = (<IncidentPill task={task} service={service} />)

    return (
      <React.Fragment>
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
                {badgePill}
              </div>
            </div>
          </td>
          <td className="d-none d-md-table-cell">{task.name} - {task.description}</td>
          <td className="d-none d-md-table-cell">{formatTime(task.creationTime)}</td>
          <td className="d-none d-md-table-cell">{formatTime(task.updateTime)}</td>
          <td className="d-none d-md-table-cell">{badgePill}</td>
        </tr>
      </React.Fragment>
    )
  }
}
