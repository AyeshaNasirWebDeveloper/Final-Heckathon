import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Replay as ReplayIcon
} from '@mui/icons-material';

const TaskCard = ({ task, users }) => {
  const { updateTaskItem, removeTask, moveTask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo._id,
    priority: task.priority,
  });

  const handleEditClick = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo._id,
      priority: task.priority,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await updateTaskItem(task._id, editedTask);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await removeTask(task._id);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleMoveTask = async (newStatus) => {
    try {
      await moveTask(task._id, newStatus);
    } catch (error) {
      console.error(`Failed to move task to ${newStatus}:`, error);
    }
  };

  // Determine which move buttons to show based on current status
  const renderMoveButtons = () => {
    // Button style for consistency
    const buttonStyle = {
      fontSize: '0.75rem',
      textTransform: 'none',
      borderRadius: 1.5,
      py: 0.5,
      px: 1.5,
      minWidth: 'auto',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }
    };

    switch (task.status) {
      case 'todo':
        return (
          <Button
            size="small"
            variant="contained"
            onClick={() => handleMoveTask('inProgress')}
            sx={{
              ...buttonStyle,
              bgcolor: '#64B5F6', // Blue for In Progress
              '&:hover': {
                bgcolor: '#42A5F5',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }
            }}
            startIcon={<ArrowForwardIcon fontSize="small" />}
          >
            Move to Doing
          </Button>
        );
      case 'inProgress':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleMoveTask('todo')}
              sx={{
                ...buttonStyle,
                bgcolor: '#B388FF', // Purple for To Do
                '&:hover': {
                  bgcolor: '#9E66FF',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }
              }}
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Back to To Do
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleMoveTask('done')}
              sx={{
                ...buttonStyle,
                bgcolor: '#FFB74D', // Orange for Done
                '&:hover': {
                  bgcolor: '#FFA726',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }
              }}
              startIcon={<CheckIcon fontSize="small" />}
            >
              Mark Done
            </Button>
          </Box>
        );
      case 'done':
        return (
          <Button
            size="small"
            variant="contained"
            onClick={() => handleMoveTask('inProgress')}
            sx={{
              ...buttonStyle,
              bgcolor: '#64B5F6', // Blue for In Progress
              '&:hover': {
                bgcolor: '#42A5F5',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }
            }}
            startIcon={<ReplayIcon fontSize="small" />}
          >
            Move to Doing
          </Button>
        );
      default:
        return null;
    }
  };

  // Determine priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#f44336'; // Red
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#4caf50'; // Green
      default:
        return '#9e9e9e'; // Grey
    }
  };

  const isCreator = user && task.createdBy && user._id === task.createdBy._id;

  return (
    <>
      <Card
        sx={{
          mb: 2,
          position: 'relative',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          },
          transition: 'all 0.2s ease-in-out',
          bgcolor: 'white'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}
              >
                {task.title}
              </Typography>
            </Box>
            <Box sx={{ ml: 1, display: 'flex' }}>
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              {isCreator && (
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    p: 0.5,
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {task.description}
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                bgcolor: 'rgba(0,0,0,0.05)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <strong>Assigned:</strong> {task.assignedTo.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                color: 'white',
                bgcolor: getPriorityColor(),
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 'bold'
              }}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Typography>
          </Box>

          {task.dueDate && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            >
              <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}

          {/* Move buttons */}
          <Box sx={{ mt: 2 }}>
            {renderMoveButtons()}
          </Box>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editedTask.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={editedTask.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="assigned-to-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-label"
              name="assignedTo"
              value={editedTask.assignedTo}
              onChange={handleInputChange}
              label="Assigned To"
            >
              {users && users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={editedTask.priority}
              onChange={handleInputChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;
