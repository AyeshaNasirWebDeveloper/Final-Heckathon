import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid
} from '@mui/material';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          mt: 4, 
          textAlign: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Task Tracker
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph>
          A simple and efficient way to manage your tasks and collaborate with your team.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/dashboard"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/login"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/register"
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Organize Tasks
            </Typography>
            <Typography variant="body1">
              Create and organize tasks into three categories: To Do, In Progress, and Done.
              Keep track of your work and never miss a deadline.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Collaborate
            </Typography>
            <Typography variant="body1">
              Assign tasks to team members, track progress, and work together efficiently.
              Everyone knows what they need to do and when.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Drag & Drop
            </Typography>
            <Typography variant="body1">
              Move tasks between columns with a simple drag and drop interface.
              Update task status visually and intuitively.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
