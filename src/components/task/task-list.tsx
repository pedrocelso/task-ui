import React, { Component } from 'react';
import { connect } from 'react-redux'
import { map, pipe, reverse } from 'ramda'

import { deauthenticate } from '../login/login-actions'
import { TaskService, Task } from '../../services/task';
import { sortByDate } from '../../modules/date';
import { AppState } from '../../App-store'
import TaskItem from './task-item'
import './task-list.scss'
import TaskEditor from './task-editor';
import { open, close } from './editor-actions';
import { EditorState } from './editor-types';

interface TaskProps {
  deauthenticate: typeof deauthenticate
  editor: EditorState
  open: typeof open
  close: typeof close
  service: TaskService;
}

interface TaskState {
  taskList: Task[];
}

export class TaskList extends Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = { taskList: [] }
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

  render() {
    const taskList = pipe(
      // @ts-ignore until curry and pipe works fine with TS
      sortByDate(`creationTime`) as Incident[],
      reverse
    )(this.state.taskList)

    const editor = (<TaskEditor service={this.props.service} />)

    return (
      <div>
        {editor}
        {map((t) => (<TaskItem task={t} key={t.id} service={this.props.service} />), taskList)}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  editor: state.editor
})
const mapDispatchToProps = { deauthenticate, open, close }
export default connect(mapStateToProps, mapDispatchToProps)(TaskList)