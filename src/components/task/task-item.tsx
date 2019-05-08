import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import { Incident, Task, TaskService } from '../../services/task';
import { deauthenticate } from '../login/login-actions'
import { Grid, Paper, Typography, LinearProgress } from '@material-ui/core';

interface TaskItemProps {
  deauthenticate: typeof deauthenticate
  task: Task;
  service: TaskService;
}

interface TaskItemState {
  loadingIncidents: boolean
  incidents: Incident[]
}

export const formatTime = (time: number): string => {
  const date = new Date(time)
  return time ? moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a") : `n/a`
}

export class TaskItem extends Component<TaskItemProps, TaskItemState> {
  state = {
    incidents: [],
    loadingIncidents: false
  }

  loadIncidents() {
    return () => {
      const {deauthenticate, service, task} = this.props
      this.setState({loadingIncidents: true})
      service.getIncidents(task.id)
        .fork(
          (e) => {
            if (e.statusCode === 401) {
              deauthenticate();
              sessionStorage.removeItem(`jwtToken`)
            } else {
              this.setState({loadingIncidents: false})
            }
          },
          (incidentList) => {
            this.setState({loadingIncidents: false})
            this.setState({incidents: incidentList})
          }
        )
    }
  }

  render() {
    const {task} = this.props
    const {loadingIncidents} = this.state
    const badgePill = loadingIncidents ? (
      <LinearProgress variant="indeterminate" />
    ) : (
      <span className="badge badge-primary badge-pill cursor-pointer card__grid__pill" onClick={this.loadIncidents()}>
        {task.incidentsCount}
      </span>
    )

    return (
      <React.Fragment>
        <tr>
          <td className="d-md-none d-table-cell">
            <Paper className="card paper-content" elevation={2}>
              <Grid container className="card__grid">
                <Grid item xs={10} sm container>
                  <Grid item xs container direction="column">
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        {task.name}
                      </Typography>
                      <Typography gutterBottom noWrap>{task.description}</Typography>
                      <Typography color="textSecondary">Created: {formatTime(task.creationTime)}</Typography>
                      <Typography color="textSecondary">Updated: {formatTime(task.updateTime)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2} className="card__grid-center">
                  {badgePill}
                </Grid>
              </Grid>
            </Paper>
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

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskItem)