import React, { Component } from 'react';
import { connect } from 'react-redux'
import { deauthenticate } from '../login/login-actions'
import { Incident, Task, TaskService } from '../../services/task';

interface IncidentPillProps {
  task: Task;
  service: TaskService;
  handler: (incidents: Incident[]) => void
  deauthenticate: typeof deauthenticate
}

interface IncidentPillState {
  loading: boolean
}

export class IncidentPill extends Component<IncidentPillProps, IncidentPillState> {
  state = {
    loading: false
  }
  
  getIncidents(taskId: number) {
    return () => {
      const {handler, service} = this.props
      this.setState({loading: true})
      service.getIncidents(taskId)
        .fork(
          (e) => {
            this.setState({loading: false})
            if (e.statusCode === 401) {
              this.props.deauthenticate();
              sessionStorage.removeItem(`jwtToken`)
            }
          },
          (incidentList) => {
            this.setState({loading: false})
            console.log(incidentList)
            handler(incidentList)
          }
        )
    }
  }

  render() {
    const {task} = this.props
    const {loading} = this.state

    const element = loading ? (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>) : (<span className="badge badge-primary badge-pill cursor-pointer" onClick={this.getIncidents(task.id)}>{task.incidentsCount}</span>)

    return element
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(IncidentPill)