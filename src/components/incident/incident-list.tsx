import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import { map, sort } from 'ramda'
import { Grid, Typography, Paper } from '@material-ui/core';

import { deauthenticate } from '../login/login-actions'
import { Incident } from '../../services/task';

interface Props {
  deauthenticate: typeof deauthenticate
  incidentList: Incident[];
}

export const formatTime = (time: number): string => {
  const date = new Date(time)
  return time ? moment(date, moment.tz.guess()).format("YYYY/MM/DD, h:mm:ss a") : `n/a`
}

export class IncidentList extends Component<Props, {}> {
  render() {
    const sortIncidents = (a: Incident, b: Incident): number => b.status - a.status
    const incidentList = sort(sortIncidents, this.props.incidentList)

    return (
      <div className="incident__paper">
        {map((t) => {
          const pendingPill = (<span className="badge badge-primary badge-pill">Pending</span>)
          const isPending = t.status === 1
          const nameEl = (
            <Typography gutterBottom variant="subtitle1" color={isPending ? `error` : `default`}>
              {t.name} {isPending ? pendingPill : null }
            </Typography>
          )

          return (
            <Paper elevation={2} square={true} key={t.id}>
              <Grid container className="card__grid">
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column">
                    <Grid item xs>
                      {nameEl}
                      <Typography className="d-none d-lg-block" gutterBottom>{t.description}</Typography>
                      <Typography color="textSecondary">Created: {formatTime(t.creationTime)}</Typography>
                      <Typography color="textSecondary">Updated: {formatTime(t.updateTime)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )
        }, incidentList)}
      </div>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(IncidentList)