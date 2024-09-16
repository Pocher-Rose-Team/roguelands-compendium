import logo from './logo.svg';
import './App.css';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Box>

      <AppBar position='static'>
        <Toolbar>
          <Menu>
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
