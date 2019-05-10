import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import { Grid, Typography, LinearProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { Incident, Task, TaskService } from '../../services/task'
import { deauthenticate } from '../login/login-actions'
import IncidentList from '../incident/incident-list'

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
      const { deauthenticate, service, task } = this.props
      this.setState({ loadingIncidents: true })
      service.getIncidents(task.id)
        .fork(
          (e) => {
            if (e.statusCode === 401) {
              deauthenticate();
              sessionStorage.removeItem(`jwtToken`)
            } else {
              this.setState({ loadingIncidents: false })
            }
          },
          (incidentList) => {
            this.setState({ loadingIncidents: false })
            this.setState({ incidents: incidentList })
          }
        )
    }
  }

  render() {
    const { task } = this.props
    const { loadingIncidents, incidents } = this.state
    const loadingBar = loadingIncidents ? (<LinearProgress variant="indeterminate" />) : null
    const incidentList = incidents && incidents.length > 0 ? (
      <ExpansionPanelDetails>
        <IncidentList incidentList={incidents} />
      </ExpansionPanelDetails>
    ) : null

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary onClick={this.loadIncidents()}>
          <Grid container className="card__grid">
            <Grid item xs={10} sm container>
              <Grid item xs container direction="column">
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {task.name}
                  </Typography>
                  <Typography className="d-none d-lg-block" gutterBottom noWrap>{task.description}</Typography>
                  <Typography color="textSecondary">Created: {formatTime(task.creationTime)}</Typography>
                  <Typography color="textSecondary">Updated: {formatTime(task.updateTime)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1} className="card__grid-center">
              <span className="badge badge-primary badge-pill cursor-pointer card__grid__pill" >
                {task.incidentsCount}
              </span>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        {incidentList}
        {loadingBar}
      </ExpansionPanel>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskItem)