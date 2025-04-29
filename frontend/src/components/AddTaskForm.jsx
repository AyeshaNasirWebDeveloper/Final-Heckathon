import { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const AddTaskForm = ({ open, handleClose, users, initialStatus = 'todo' }) => {
  const { addTask } = useContext(TaskContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: initialStatus
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update status when initialStatus changes
  useEffect(() => {
    if (open) {
      setFormData(prev => ({ ...prev, status: initialStatus }));
    }
  }, [initialStatus, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    if (!formData.assignedTo) {
      setError('Please assign this task to someone');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addTask(formData);

      // Reset form
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        status: initialStatus
      });

      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          pb: 1
        }}
      >
        Add New Task
      </DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        {error && (
          <Box
            sx={{
              color: 'white',
              mb: 2,
              bgcolor: '#f44336',
              p: 1.5,
              borderRadius: 1,
              fontSize: '0.875rem'
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          sx={{
            mb: 2,
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5
            }
          }}
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
          value={formData.description}
          onChange={handleChange}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5
            }
          }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="assigned-to-label">Assigned To</InputLabel>
          <Select
            labelId="assigned-to-label"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            label="Assigned To"
            sx={{
              borderRadius: 1.5,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: 1.5
              }
            }}
          >
            {users && users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"
            sx={{
              borderRadius: 1.5,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: 1.5
              }
            }}
          >
            <MenuItem value="low">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
                Low
              </Box>
            </MenuItem>
            <MenuItem value="medium">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800', mr: 1 }} />
                Medium
              </Box>
            </MenuItem>
            <MenuItem value="high">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336', mr: 1 }} />
                High
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
            sx={{
              borderRadius: 1.5,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: 1.5
              }
            }}
          >
            <MenuItem value="todo">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#B388FF', mr: 1 }} />
                To Do
              </Box>
            </MenuItem>
            <MenuItem value="inProgress">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#64B5F6', mr: 1 }} />
                Doing
              </Box>
            </MenuItem>
            <MenuItem value="done">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFB74D', mr: 1 }} />
                Review
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            bgcolor: '#651fff',
            '&:hover': {
              bgcolor: '#4615b2'
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskForm;
