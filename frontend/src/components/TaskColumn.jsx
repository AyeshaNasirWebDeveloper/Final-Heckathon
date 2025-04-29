import { useState } from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import TaskCard from './TaskCard';
import AddIcon from '@mui/icons-material/Add';
import AddTaskForm from './AddTaskForm';

const getColumnColor = (id) => {
  switch (id) {
    case 'todo':
      return '#B388FF'; // Purple for To Do
    case 'inProgress':
      return '#64B5F6'; // Blue for Doing/In Progress
    case 'done':
      return '#FFB74D'; // Orange for Review/Done
    default:
      return '#E0E0E0';
  }
};

const TaskColumn = ({ title, tasks = [], id, users }) => { // default empty array for tasks
  const [openAddTaskForm, setOpenAddTaskForm] = useState(false);

  const handleOpenAddTaskForm = () => {
    setOpenAddTaskForm(true);
  };

  const handleCloseAddTaskForm = () => {
    setOpenAddTaskForm(false);
  };

  return (
    <>
    <Paper
      elevation={3}
      sx={{
        p: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: getColumnColor(id),
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {title} <span style={{ opacity: 0.8 }}>({tasks.length})</span>
        </Typography>
        <IconButton
          size="small"
          onClick={handleOpenAddTaskForm}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: '300px',
          overflowY: 'auto',
          p: 2,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          transition: 'background-color 0.2s ease',
          border: '2px solid transparent',
        }}
      >
            {tasks.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'white',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h4">✓</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  No Tasks
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Limit the number of tasks in this section to keep your team focused and efficient
                </Typography>
              </Box>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id || index} // Ensure key uniqueness
                  task={task}
                  users={users}
                />
              ))
            )}
          </Box>
    </Paper>

    {/* Add Task Form with pre-selected status based on column */}
    <AddTaskForm
      open={openAddTaskForm}
      handleClose={handleCloseAddTaskForm}
      users={users}
      initialStatus={id}
    />
    </>
  );
};

export default TaskColumn;
