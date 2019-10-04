import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Menu } from "@material-ui/icons";
import { equals, find, findIndex, insert, map, pathOr, pipe, startsWith } from 'ramda';

import { open } from './task/editor-actions'

import './navbar.scss'
import { EditorState } from './task/editor-types';
import { AppState } from '../App-store'

export interface Item {
  title: string
  path: string
  icon: JSX.Element
  private: boolean
  route: JSX.Element
}

interface MenuProps {
  editor: EditorState
  location: string
  open: typeof open
  items?: Item[]
}

interface MenuState {
  drawerOpened: boolean
}

export class NavBar extends Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props)
    this.state = { drawerOpened: false }
  }

  toggleDrawer = (flag: boolean): React.ReactEventHandler<{}> => () => {
    this.setState({ drawerOpened: flag });
  }

  getTitle = (path: string) => {
    return pipe(
      find<Item>(item => startsWith(item.path, path)),
      pathOr(``, [`title`])
    )(this.props.items!)
  }

  render() {
    const { drawerOpened } = this.state

    const title = this.getTitle(this.props.location)

    const divideList = (l: JSX.Element[]) => {
      const index = findIndex((a: JSX.Element) => equals(`Logout`, a.key), l)
      return insert(index, (<Divider key="divider" />), l)
    }

    const items = pipe(
      map((i: Item) => (
        // @ts-ignore
        <ListItem button key={i.title} to={i.path} component={Link} onClick={this.toggleDrawer(false)}>
          {i.icon}
          <ListItemText primary={i.title} />
        </ListItem>
      )),
      divideList
    )(this.props.items!)

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menu-button" color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Typography className="toolbar-title" variant="h6" color="inherit">
              {title}
            </Typography>
            {title === `Tasks` ? (<Button variant="contained" color="secondary" onClick={this.props.open}>Create</Button>) : null}
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" variant="temporary" open={drawerOpened} onClose={this.toggleDrawer(false)} >
          {items}
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  editor: state.editor
})
const mapDispatchToProps = { open }
export default connect(mapStateToProps, mapDispatchToProps)(NavBar)