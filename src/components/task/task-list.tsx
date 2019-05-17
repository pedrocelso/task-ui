import React, { Component } from 'react';
import { connect } from 'react-redux'
import { map } from 'ramda'
import { Add as AddIcon } from "@material-ui/icons";

import { deauthenticate } from '../login/login-actions'
import { TaskService, Task } from '../../services/task';
import TaskItem from './task-item'
import './task-list.scss'
import { Fab } from '@material-ui/core';
import { TaskEditor } from './task-editor';

interface TaskProps {
  deauthenticate: typeof deauthenticate
  service: TaskService;
}

interface TaskState {
  taskList: Task[];
  editorOpen: boolean
}

export class TaskList extends Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = { taskList: [], editorOpen: false }
  }

  componentDidMount() {
    const { service } = this.props
    service.getTasks()
      .fork(
        (e) => {
          if (e.statusCode === 401) {
            this.props.deauthenticate();
            sessionStorage.removeItem(`jwtToken`)
          }
        },
        (taskList) => {
          this.setState({ taskList })
        }
      )
  }

  toggleEditor = () => (b: boolean) => {
    this.setState({ editorOpen: b })
  }

  showEditor = () => {
    this.toggleEditor()(true)
  }

  closeEditor = () => {
    this.toggleEditor()(false)
  }

  render() {
    const { state } = this
    const { editorOpen, taskList } = state

    const editor = (<TaskEditor open={editorOpen} close={this.toggleEditor()} />)

    return (
      <div>
        {editor}
        {map((t) => (<TaskItem task={t} key={t.id} service={this.props.service} />), taskList)}
        <Fab color="secondary" className="fab" aria-label="Add" onClick={this.showEditor}>
          <AddIcon />
        </Fab>
      </div>
    )
  }
}

const mapDispatchToProps = { deauthenticate }
export default connect(null, mapDispatchToProps)(TaskList)