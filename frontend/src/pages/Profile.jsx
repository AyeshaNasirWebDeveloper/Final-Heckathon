import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAssignedTasks } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  LinearProgress,
  Stack,
  Menu,
  MenuItem,
  Fade,
  Modal,
  Switch,
  FormControlLabel,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  LowPriority as LowPriorityIcon,
  FiberManualRecord as MediumPriorityIcon,
  PriorityHigh as HighPriorityIcon,
  CheckCircle as CheckCircleIcon,
  DonutLarge as DonutLargeIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  MoreVert as MoreVertIcon,
  CloudUpload as CloudUploadIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user, updateProfile, error: authError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // New state variables for enhanced UI
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [taskStats, setTaskStats] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });

  // Theme and responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Additional interactive UI state
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [starredTasks, setStarredTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [themeColor, setThemeColor] = useState('#651fff'); // Default purple theme
  const [isLoading, setIsLoading] = useState(false);

  // Menu open state
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setTasksLoading(true);
        const tasks = await getAssignedTasks();
        // Check if tasks is an array before proceeding
        if (Array.isArray(tasks)) {
          setAssignedTasks(tasks);

          // Calculate task statistics
          const stats = {
            todo: 0,
            inProgress: 0,
            done: 0,
            total: tasks.length,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
          };

          tasks.forEach(task => {
            // Count by status
            if (task.status === 'todo') stats.todo++;
            else if (task.status === 'inProgress') stats.inProgress++;
            else if (task.status === 'done') stats.done++;

            // Count by priority
            if (task.priority === 'high') stats.highPriority++;
            else if (task.priority === 'medium') stats.mediumPriority++;
            else if (task.priority === 'low') stats.lowPriority++;
          });

          setTaskStats(stats);
        } else {
          // If tasks is not an array, set an empty array
          setAssignedTasks([]);
          setTaskStats({
            todo: 0,
            inProgress: 0,
            done: 0,
            total: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch assigned tasks:', error);
        // Set empty arrays/objects on error
        setAssignedTasks([]);
        setTaskStats({
          todo: 0,
          inProgress: 0,
          done: 0,
          total: 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0
        });
      } finally {
        setTasksLoading(false);
      }
    };

    if (user) {
      fetchAssignedTasks();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode && user) {
      // Reset form data when canceling edit
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  // Get priority icon based on priority level
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <HighPriorityIcon sx={{ color: '#f44336' }} />;
      case 'medium':
        return <MediumPriorityIcon sx={{ color: '#ff9800' }} />;
      case 'low':
        return <LowPriorityIcon sx={{ color: '#4caf50' }} />;
      default:
        return null;
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon sx={{ color: '#FFB74D' }} />;
      case 'inProgress':
        return <DonutLargeIcon sx={{ color: '#64B5F6' }} />;
      case 'todo':
        return <RadioButtonUncheckedIcon sx={{ color: '#B388FF' }} />;
      default:
        return null;
    }
  };

  // Get color for task status
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return '#B388FF'; // Purple
      case 'inProgress':
        return '#64B5F6'; // Blue
      case 'done':
        return '#FFB74D'; // Orange
      default:
        return '#9e9e9e'; // Grey
    }
  };

  // Handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle avatar modal open
  const handleAvatarModalOpen = () => {
    setOpenAvatarModal(true);
    setAvatarHover(false);
  };

  // Handle avatar modal close
  const handleAvatarModalClose = () => {
    setOpenAvatarModal(false);
  };

  // Toggle task star status
  const toggleStarTask = (taskId) => {
    if (starredTasks.includes(taskId)) {
      setStarredTasks(starredTasks.filter(id => id !== taskId));
      showSnackbar('Task removed from favorites');
    } else {
      setStarredTasks([...starredTasks, taskId]);
      showSnackbar('Task added to favorites');
    }
  };

  // Toggle completed tasks visibility
  const toggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  // Change theme color
  const changeThemeColor = (color) => {
    setThemeColor(color);
    showSnackbar('Theme color updated');
  };

  // Show snackbar message
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Only include password if it was provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      setIsLoading(true);
      await updateProfile(updateData);

      // Clear password fields and exit edit mode
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });

      // Exit edit mode after successful update
      setEditMode(false);

      // Show success message
      setSuccess('Profile updated successfully');
      showSnackbar('Profile updated successfully');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setIsLoading(false);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      showSnackbar(errorMessage);
      setIsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        mb: 4
      }}>
        {/* Profile Header with Cover Image */}
        <Box sx={{
          height: 200,
          bgcolor: '#651fff',
          backgroundImage: 'linear-gradient(135deg, #651fff 0%, #a963ff 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          p: 3
        }}>
          {/* Avatar with Edit Overlay */}
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: 2,
                fontSize: '3rem',
                bgcolor: themeColor,
                position: 'relative',
                zIndex: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              alt={user?.name || 'User'}
              src={user?.avatar || ''}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={handleAvatarModalOpen}
            >
              {user?.name ? user.name.charAt(0) : 'U'}
            </Avatar>

            {/* Camera Icon Overlay */}
            {avatarHover && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2
              }}
              onClick={handleAvatarModalOpen}
              >
                <PhotoCameraIcon sx={{ color: 'white', fontSize: '2rem' }} />
              </Box>
            )}
          </Box>

          {/* User Info */}
          <Box sx={{ color: 'white', mb: 1, flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {user?.email || 'No email provided'}
            </Typography>
          </Box>

          {/* Role Badge and Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={user?.role === 'admin' ? 'Admin' : 'User'}
              color={user?.role === 'admin' ? 'secondary' : 'default'}
              sx={{
                bgcolor: user?.role === 'admin' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                color: user?.role === 'admin' ? themeColor : 'rgba(0,0,0,0.7)',
                fontWeight: 'bold',
                mr: 1
              }}
            />

            <Tooltip title="Profile options">
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    boxShadow: 3,
                    borderRadius: 2,
                    minWidth: 180
                  }
                }
              }}
              slots={{
                transition: Fade
              }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                setActiveTab(0);
                setEditMode(true);
              }}>
                <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
                Edit Profile
              </MenuItem>

              <MenuItem onClick={() => {
                handleMenuClose();
                setActiveTab(2);
              }}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                Settings
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => {
                handleMenuClose();
                changeThemeColor('#651fff'); // Purple
              }}>
                <PaletteIcon fontSize="small" sx={{ mr: 1.5, color: '#651fff' }} />
                Purple Theme
              </MenuItem>

              <MenuItem onClick={() => {
                handleMenuClose();
                changeThemeColor('#2196f3'); // Blue
              }}>
                <PaletteIcon fontSize="small" sx={{ mr: 1.5, color: '#2196f3' }} />
                Blue Theme
              </MenuItem>

              <MenuItem onClick={() => {
                handleMenuClose();
                changeThemeColor('#f44336'); // Red
              }}>
                <PaletteIcon fontSize="small" sx={{ mr: 1.5, color: '#f44336' }} />
                Red Theme
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<PersonIcon />}
              label="Profile"
              iconPosition="start"
            />
            <Tab
              icon={<AssignmentIcon />}
              label={
                <Badge badgeContent={assignedTasks.length} color="primary" max={99}>
                  Tasks
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              icon={<SettingsIcon />}
              label="Settings"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box>
              {/* Success/Error Messages */}
              {(error || authError) && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error || authError}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Profile Info Card */}
              <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(101, 31, 255, 0.05)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}>
                    <Typography variant="h6" component="h2">
                      Personal Information
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={toggleEditMode}
                      color={editMode ? "error" : "primary"}
                    >
                      {editMode ? <CancelIcon /> : <EditIcon />}
                    </IconButton>
                  </Box>

                  {editMode ? (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <TextField
                        margin="normal"
                        fullWidth
                        id="bio"
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                        placeholder="Tell us about yourself"
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3
                        }}
                      >
                        {loading || isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                            {user.name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Email Address
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                            {user.email}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Account Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                            {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Bio
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {user.bio || 'No bio provided yet.'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Password Change Card */}
              {editMode && (
                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{
                      p: 2,
                      bgcolor: 'rgba(101, 31, 255, 0.05)',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                    }}>
                      <Typography variant="h6" component="h2">
                        Change Password
                      </Typography>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Tasks Tab */}
          {activeTab === 1 && (
            <Box>
              {/* Task Statistics */}
              <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'rgba(101, 31, 255, 0.05)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}>
                    <Typography variant="h6" component="h2">
                      Task Statistics
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Status Distribution */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Status Distribution
                        </Typography>

                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <RadioButtonUncheckedIcon sx={{ mr: 1, color: '#B388FF' }} fontSize="small" />
                                To Do
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.todo} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.todo / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(179, 136, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#B388FF'
                                }
                              }}
                            />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <DonutLargeIcon sx={{ mr: 1, color: '#64B5F6' }} fontSize="small" />
                                In Progress
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.inProgress} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.inProgress / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(100, 181, 246, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#64B5F6'
                                }
                              }}
                            />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon sx={{ mr: 1, color: '#FFB74D' }} fontSize="small" />
                                Done
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.done} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.done / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 183, 77, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#FFB74D'
                                }
                              }}
                            />
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Priority Distribution */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Priority Distribution
                        </Typography>

                        <Stack spacing={1.5}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HighPriorityIcon sx={{ mr: 1, color: '#f44336' }} fontSize="small" />
                                High Priority
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.highPriority} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.highPriority / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(244, 67, 54, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#f44336'
                                }
                              }}
                            />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <MediumPriorityIcon sx={{ mr: 1, color: '#ff9800' }} fontSize="small" />
                                Medium Priority
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.mediumPriority} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.mediumPriority / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 152, 0, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#ff9800'
                                }
                              }}
                            />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LowPriorityIcon sx={{ mr: 1, color: '#4caf50' }} fontSize="small" />
                                Low Priority
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {taskStats.lowPriority} of {taskStats.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={taskStats.total ? (taskStats.lowPriority / taskStats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#4caf50'
                                }
                              }}
                            />
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Task List */}
              <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'rgba(101, 31, 255, 0.05)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h6" component="h2">
                      Your Tasks ({assignedTasks.length})
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={showCompletedTasks}
                            onChange={toggleCompletedTasks}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: themeColor,
                                '&:hover': {
                                  backgroundColor: `${themeColor}20`
                                }
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: themeColor
                              }
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Show Completed
                          </Typography>
                        }
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </Box>

                  {tasksLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : assignedTasks.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {assignedTasks
                        .filter(task => showCompletedTasks || task.status !== 'done')
                        .map((task) => (
                        <ListItem
                          key={task._id}
                          divider
                          sx={{
                            borderLeft: `4px solid ${getStatusColor(task.status)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.02)'
                            },
                            position: 'relative',
                            overflow: 'hidden',
                            pr: 6 // Make room for action buttons
                          }}
                        >
                          {/* Star button */}
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              color: starredTasks.includes(task._id) ? 'warning.main' : 'action.disabled',
                              '&:hover': { color: starredTasks.includes(task._id) ? 'warning.dark' : 'text.secondary' }
                            }}
                            onClick={() => toggleStarTask(task._id)}
                          >
                            {starredTasks.includes(task._id) ?
                              <StarIcon fontSize="small" /> :
                              <StarBorderIcon fontSize="small" />
                            }
                          </IconButton>

                          <ListItemText
                            primary={
                              <Box sx={{ pr: 4 }}> {/* Make room for star button */}
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {task.title}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                                  <Chip
                                    size="small"
                                    label={task.status === 'todo' ? 'To Do' :
                                          task.status === 'inProgress' ? 'In Progress' : 'Done'}
                                    icon={getStatusIcon(task.status)}
                                    sx={{
                                      bgcolor: `${getStatusColor(task.status)}20`,
                                      color: getStatusColor(task.status),
                                      fontWeight: 'medium',
                                      borderRadius: 1,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: `${getStatusColor(task.status)}30`,
                                      }
                                    }}
                                  />

                                  <Chip
                                    size="small"
                                    label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    icon={getPriorityIcon(task.priority)}
                                    sx={{
                                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                                      borderRadius: 1,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                      }
                                    }}
                                  />

                                  {task.dueDate && (
                                    <Chip
                                      size="small"
                                      icon={<CalendarTodayIcon fontSize="small" />}
                                      label={new Date(task.dueDate).toLocaleDateString()}
                                      sx={{
                                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                                        borderRadius: 1,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  )}
                                </Box>

                                {task.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      mt: 1,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {task.description}
                                  </Typography>
                                )}

                                {/* Task metadata */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    color: 'text.disabled',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                                  <Typography variant="caption">
                                    Updated {new Date(task.updatedAt || Date.now()).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4
                    }}>
                      <AssignmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Tasks Assigned
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        You don't have any tasks assigned to you yet.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Settings Tab */}
          {activeTab === 2 && (
            <Box>
              <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'rgba(101, 31, 255, 0.05)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}>
                    <Typography variant="h6" component="h2">
                      Account Settings
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Change Password
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                      <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                        slotProps={{
                          input: {
                            sx: { borderRadius: 2 }
                          }
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3
                        }}
                      >
                        {loading || isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
      {/* Avatar Upload Modal */}
      <Modal
        open={openAvatarModal}
        onClose={handleAvatarModalClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAvatarModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 400,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Update Profile Picture
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  fontSize: '4rem',
                  mb: 2,
                  bgcolor: themeColor
                }}
                alt={user.name}
                src={user.avatar || ''}
              >
                {user.name.charAt(0)}
              </Avatar>

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                />
              </Button>
              <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                Recommended size: 300x300 pixels
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                onClick={handleAvatarModalClose}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: themeColor,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light'
                      ? `${themeColor}dd` // Slightly darker (reduced opacity)
                      : `${themeColor}bb` // Slightly lighter (reduced opacity)
                  }
                }}
                onClick={() => {
                  handleAvatarModalClose();
                  showSnackbar('Profile picture updated');
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: themeColor,
            borderRadius: 2
          }
        }}
      />
    </Container>
  );
};

export default Profile;
