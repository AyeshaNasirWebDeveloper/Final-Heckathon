import { useState, useContext, useEffect } from 'react';
<<<<<<< HEAD
// import { DragDropContext } from 'react-beautiful-dnd';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { getUsers } from '../services/api';
// import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
=======
import { DragDropContext } from 'react-beautiful-dnd';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { getUsers } from '../services/api';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
>>>>>>> 7a912b2ae05edfd5216c58cd8cfff9d03513a469
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import TaskColumn from '../components/TaskColumn';
import AddTaskForm from '../components/AddTaskForm';

const Dashboard = () => {
  const {
    todoTasks,
    inProgressTasks,
    doneTasks,
    loading,
    error,
<<<<<<< HEAD
=======
    moveTask,
>>>>>>> 7a912b2ae05edfd5216c58cd8cfff9d03513a469
    refreshTasks
  } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [openAddTaskForm, setOpenAddTaskForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenAddTaskForm = () => {
    setOpenAddTaskForm(true);
  };

  const handleCloseAddTaskForm = () => {
    setOpenAddTaskForm(false);
  };

  if (loading || usersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f7fa',
        pt: 3,
        pb: 5
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Task Board
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={refreshTasks}
                sx={{
                  mr: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 2
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenAddTaskForm}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 2,
                  bgcolor: '#651fff',
                  '&:hover': {
                    bgcolor: '#4615b2'
                  }
                }}
              >
                Add New Task
              </Button>
            </Box>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Use the move buttons to change task status
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TaskColumn
              title="To Do"
              tasks={todoTasks}
              id="todo"
              users={users}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskColumn
              title="Doing"
              tasks={inProgressTasks}
              id="inProgress"
              users={users}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskColumn
              title="Review"
              tasks={doneTasks}
              id="done"
              users={users}
            />
          </Grid>
        </Grid>

        <AddTaskForm
          open={openAddTaskForm}
          handleClose={handleCloseAddTaskForm}
          users={users}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
