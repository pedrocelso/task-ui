import React, { Component } from 'react';
import { map } from 'ramda'
import {
  AppBar,
  Drawer,
  IconButton,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core'
import MenuIcon from "@material-ui/icons/Menu";
import {find, pathOr, pipe, startsWith} from 'ramda';

import './navbar.scss'

export interface Item {
  title: string
  path: string
}

interface MenuProps {
  redirect: (path: string) => () => void;
}

interface MenuState {
  drawerOpened: boolean
}

const menuItems: Item[] = [
  {title: `Users`, path: `/users`},
  {title: `Tasks`, path: `/tasks`}
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

  render() {
    const {redirect} = this.props
    const {drawerOpened} = this.state

    const title = this.getTitle(document.location.pathname)

    const items: JSX.Element[] = map((i: Item) => (
      <ListItem button key={i.title}>
        <ListItemText primary={i.title} onClick={redirect(i.path)} />
      </ListItem>
    ), menuItems)

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menu-button" color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
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
