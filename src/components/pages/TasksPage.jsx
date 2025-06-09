import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import TaskForm from '@/components/organisms/TaskForm';
import CalendarView from '@/components/organisms/CalendarView';
import TaskListForDate from '@/components/organisms/TaskListForDate';
import { tasksService, contactsService, companiesService } from '@/services';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]); // Currently not used in this refactored task, but kept for future expansion or if relatedTo is implemented
  const [companies, setCompanies] = useState([]); // Currently not used in this refactored task, but kept for future expansion or if relatedTo is implemented
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'John Doe',
    relatedTo: { type: '', id: '' }
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-error' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { value: 'completed', label: 'Completed', color: 'bg-success' }
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData, companiesData] = await Promise.all([
        tasksService.getAll(),
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getTasksForDate = useCallback((date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  }, [tasks]);

  const getPriorityColor = useCallback((priority) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-500';
  }, [priorities]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'John Doe',
      relatedTo: { type: '', id: '' }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const updated = await tasksService.update(editingTask.id, formData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await tasksService.create(formData);
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setFormData({
      ...task,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm')
    });
    setShowModal(true);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(id);
        setTasks(prev => prev.filter(t => t.id !== id));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await tasksService.update(task.id, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: format(date, 'yyyy-MM-dd\'T\'09:00')
    }));
    setShowModal(true);
  }, []);
  
  const selectedDateTasks = getTasksForDate(selectedDate);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={loadData}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and schedule</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white hover:bg-primary/90"
          icon={<ApperIcon name="Plus" className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={handleDateClick}
            getTasksForDate={getTasksForDate}
            getPriorityColor={getPriorityColor}
          />
        </div>
        <TaskListForDate
          selectedDate={selectedDate}
          selectedDateTasks={selectedDateTasks}
          getPriorityColor={getPriorityColor}
          handleToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddTask={() => handleDateClick(selectedDate)}
        />
      </div>

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Add Task'}
      >
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          editingTask={editingTask}
          priorities={priorities}
          statuses={statuses}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;