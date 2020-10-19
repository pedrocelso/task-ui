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
import { ResponseError } from '../../api';
import { fork } from 'fluture';

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

    const errHandler = (e: ResponseError) => {
      if (e.statusCode === 401) {
        this.props.deauthenticate();
        sessionStorage.removeItem(`jwtToken`)
      }
    }
    const successHandler = (taskList: Task[]) => {
      this.setState({ taskList })
    }

    service.getTasks()
      .pipe(fork(errHandler)(successHandler))
  }

  render() {
    const taskList = pipe<Task[], any, Task[]>(
      sortByDate(`creationTime`),
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