import React, { Component } from 'react';
import { LinearProgress, Typography, Button, Dialog, AppBar, Toolbar, IconButton, Slide, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Form, { UiSchema } from "react-jsonschema-form"
import { JSONSchema6 } from 'json-schema';
import { toast } from 'react-toastify';
import { TaskService, Task } from '../../services/task';
import { AppState } from '../../App-store'
import { connect } from 'react-redux';
import { deauthenticate } from '../login/login-actions';
import { open, close } from './editor-actions';
import { EditorState } from './editor-types';
import { ResponseError } from '../../api';
import { fork } from 'fluture';

export function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export interface TaskEditorProps {
  deauthenticate: typeof deauthenticate
  editor: EditorState
  open: typeof open
  close: typeof close
  service: TaskService;
}

export interface TaskEditorState {
  formData: Object
  loading: boolean
}

const notify = (feeling: number) => (msg: string) => {
  switch (feeling) {
    case (-1):
      toast.error(msg);
  }
}

const taskSchema: JSONSchema6 = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string", title: "Task name", default: "" },
    description: { type: "string", title: "Description", default: "" }
  }
};

// const incidentSchema: JSONSchema6 = {
//   type: "object",
//   required: ["name"],
//   properties: {
//     name: { type: "string", title: "Task name", default: "" },
//     status: {
//       type: "number", title: "Status", default: 1, anyOf: [
//         {
//           "type": "number",
//           "title": "Done",
//           "enum": [
//             0
//           ]
//         },
//         {
//           "type": "number",
//           "title": "Pending",
//           "enum": [
//             1
//           ]
//         }
//       ]
//     },
//     description: { type: "string", title: "Description", default: "" }
//   }
// };

const uiSchema: UiSchema = {
  description: {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 5
    }
  }
}

export class TaskEditor extends Component<TaskEditorProps, TaskEditorState> {
  state = {
    formData: {},
    loading: false
  }

  handleClose = () => {
    this.props.close()
  };

  handleSubmit = () => {
    const { formData } = this.state
    const { service, deauthenticate } = this.props

    this.setState({ loading: true })

    const errHandler = (e: ResponseError) => {
      this.setState({ loading: false })
      if (e.statusCode === 401) {
        deauthenticate();
        sessionStorage.removeItem(`jwtToken`)
      } else {
        console.error(e)
        notify(-1)(`An error has occured. Please try again later.`)
      }
    }
    const successHandler = ({ task }: { task: Task }) => {
      this.setState({ loading: false, formData: {} })
      notify(1)(`User ${task.name} created!`)
      this.props.close()
    }
    service.createTask(formData as Task)
      .pipe(fork(errHandler)(successHandler))

  }

  handleChange = ({ formData }: { formData: Object }) => {
    this.setState({ formData })
  }

  render() {
    const taskActionLabel = "Create"

    const { loading } = this.state

    const loadingbar = loading ? <LinearProgress className="loading-bar" variant="indeterminate" /> : null

    return (
      <Dialog
        open={this.props.editor.open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        className="editor"
        scroll="paper"
      >
        <DialogContent className="editor__content">
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className="toolbar-title">
                {taskActionLabel} Task
              </Typography>
              <Button color="inherit" onClick={this.handleSubmit}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <div className="loading-bar">{loadingbar}</div>
          <Form
            className="editor__form"
            schema={taskSchema}
            uiSchema={uiSchema}
            formData={this.state.formData}
            onError={notify(-1)}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          >
            <button className="hidden" />
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  editor: state.editor
})
const mapDispatchToProps = { deauthenticate, open, close }
export default connect(mapStateToProps, mapDispatchToProps)(TaskEditor)