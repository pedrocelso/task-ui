import React, { Component } from 'react';
import {
  AppBar,
  Drawer,
  IconButton,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {Lock, Menu, People, Storage} from "@material-ui/icons";
import {find, filter, map, pathOr, pipe, startsWith} from 'ramda';

import './navbar.scss'

export interface Item {
  title: string
  path: string
  icon: JSX.Element
  private: boolean
}

interface MenuProps {
  authenticated: boolean
}

interface MenuState {
  drawerOpened: boolean
}

const menuItems: Item[] = [
  {title: `Login`, path: `/login`, icon: (<Lock color="primary" />), private: false},
  {title: `Users`, path: `/users`, icon: (<People color="primary" />), private: true},
  {title: `Tasks`, path: `/tasks`, icon: (<Storage color="primary" />), private: true}
]

class NavBar extends Component<MenuProps, MenuState> {
  constructor(props: any) {
    super(props)

    this.state = {drawerOpened: false}
  }
  
  toggleDrawer = (flag: boolean): React.ReactEventHandler<{}> => () => {
    this.setState({drawerOpened: flag});
  }

  getTitle = (path: string) => {
    return pipe(
      find<Item>(item => startsWith(item.path, path)),
      pathOr(``, [`title`])
    )(menuItems)
  }

  getMenuItems = (): Item[] => {
    const {authenticated} = this.props
    return filter<Item>((i: Item): boolean => {
      return i.private === authenticated
    }, menuItems)
  }

  render() {
    const {drawerOpened} = this.state
    const menuItems = this.getMenuItems()

    const title = this.getTitle(document.location.pathname)

    const items: JSX.Element[] =  map((i: Item) => (
        // @ts-ignore
        <ListItem button key={i.title} to={i.path} component={Link} onClick={this.toggleDrawer(false)}>
          {i.icon}
          <ListItemText primary={i.title} />
        </ListItem>
      ), menuItems)

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

export default NavBar;