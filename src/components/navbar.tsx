import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  AppBar,
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
import { equals, find, findIndex, filter, insert, map, pathOr, pipe, startsWith } from 'ramda';

import './navbar.scss'
import { AppState } from '../App-store';

export interface Item {
  title: string
  path: string
  icon: JSX.Element
  private: boolean
  route: JSX.Element
}

interface MenuProps {
  authenticated: boolean
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
    const { authenticated } = this.props

    const title = this.getTitle(document.location.pathname)

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
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
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
  authenticated: state.login.authenticated
})
export default connect(mapStateToProps)(NavBar)