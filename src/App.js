import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

function App() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <div className="App">
      <Box>

      <AppBar position='static'>
        <Toolbar>
          <Menu open={anchorElNav} anchorEl={anchorElNav} onClose={handleCloseNavMenu}>
            <MenuItem>
              <Typography>Test</Typography>
            </MenuItem>
          </Menu>
          </Toolbar>
      </AppBar>
      </Box>
      
    </div>
  );
}

export default App;
