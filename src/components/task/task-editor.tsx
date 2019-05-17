import React, { Component } from 'react';
import { Typography, Button, Dialog, AppBar, Toolbar, IconButton, Slide, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Form, { UiSchema } from "react-jsonschema-form"
import { JSONSchema6 } from 'json-schema';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export interface TaskEditorProps {
  open: boolean
  close: (b: boolean) => void
}

const schema: JSONSchema6 = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string", title: "Task name", default: "" },
    done: { type: "boolean", title: "Done?", default: false }
  }
};

const log = (type: any) => console.log.bind(console, type);

export class TaskEditor extends Component<TaskEditorProps, {}> {
  handleClose = () => {
    this.props.close(false)
  };

  render() {
    const onSubmit = ({ formData }: any) => console.log("Data submitted: ", formData);
    let yourForm
    const taskActionLabel = "Create"
    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        className="editor"
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="toolbar-title">
              {taskActionLabel} Task
            </Typography>
            <Button color="inherit" onClick={this.handleClose}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Form
          className="editor__form"
          schema={schema}
          ref={(form) => { yourForm = form; }}
          onChange={log("changed")}
          onError={log("errors")}>
          <button className="hidden" />
        </Form>
      </Dialog>
    )
  }
}
