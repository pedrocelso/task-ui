import React, { Component } from 'react';
import { Grid, Typography, LinearProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button, Dialog, AppBar, Toolbar, IconButton, List, ListItem, ListItemText, Divider, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export interface TaskEditorProps {
  open: boolean
  close: (b: boolean) => void
}

export class TaskEditor extends Component<TaskEditorProps,{}> {
  handleClose = () => {
    this.props.close(false)
  };

  render() {
    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" >
              Sound
            </Typography>
            <Button color="inherit" onClick={this.handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    )
  }
}
