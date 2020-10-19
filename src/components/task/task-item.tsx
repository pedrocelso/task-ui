import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, LinearProgress, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Incident, Task, TaskService } from '../../services/task'
import { deauthenticate } from '../login/login-actions'
import IncidentList from '../incident/incident-list'
import { formatTime } from '../../modules/date';
import { ResponseError } from '../../api';
import { fork } from 'fluture';

interface TaskItemProps {
  deauthenticate: typeof deauthenticate
  task: Task;
  service: TaskService;
}

interface TaskItemState {
  loadingIncidents: boolean
  incidents: Incident[]
}

export class TaskItem extends Component<TaskItemProps, TaskItemState> {
  state = {
    incidents: [],
    loadingIncidents: false
  }

  loadIncidents() {
    return () => {
      const { deauthenticate, service, task } = this.props

      const errHandler = (e: ResponseError) => {
        if (e.statusCode === 401) {
          deauthenticate();
          sessionStorage.removeItem(`jwtToken`)
        } else {
          this.setState({ loadingIncidents: false })
        }
      }
      const successHandler = (incidentList: Incident[]) => {
        this.setState({ loadingIncidents: false })
        this.setState({ incidents: incidentList })
      }

      if (task.incidentsCount) {
        this.setState({ loadingIncidents: true })
        service.getIncidents(task.id)
          .pipe(fork(errHandler)(successHandler))
      }
    }
  }

  render() {
    const { task } = this.props
    const { loadingIncidents, incidents } = this.state
    const loadingBar = loadingIncidents ? (<LinearProgress variant="indeterminate" />) : null
    const incidentList = incidents && incidents.length > 0 ? (
      <AccordionDetails className="incident">
        <IncidentList incidentList={incidents} />
      </AccordionDetails>
    ) : null

    const pendingIncidents = !!task.pendingIncidentsCount ? (<span className="badge badge-primary badge-pill cursor-pointer card__grid__pill">
      {task.pendingIncidentsCount}
    </span>) : null;

    const totalIncidents = task.incidentsCount ? (<Typography color="textSecondary">Total Incidents: {task.incidentsCount}</Typography>) : null

    return (
      <Accordion>
        <AccordionSummary onClick={this.loadIncidents()} expandIcon={<ExpandMoreIcon />}>
          <Grid container className="card__grid">
            <Grid item xs={10} sm container>
              <Grid item xs container direction="column">
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {task.name}
                  </Typography>
                  <Typography className="d-none d-lg-block" gutterBottom>{task.description}</Typography>
                  {totalIncidents}
                  <Typography color="textSecondary">Created: {formatTime(task.creationTime)}</Typography>
                  <Typography color="textSecondary">Updated: {formatTime(task.updateTime)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1} className="card__grid-center">
              {pendingIncidents}
            </Grid>
          </Grid>
        </AccordionSummary>
        {loadingBar}
        {incidentList}
      </Accordion>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskItem)