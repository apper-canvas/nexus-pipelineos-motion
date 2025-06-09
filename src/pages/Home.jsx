import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import Chart from 'react-apexcharts';
import { contactsService, dealsService, tasksService } from '../services';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const [quickStats, setQuickStats] = useState({
    totalRevenue: 0,
    activeDeals: 0,
    totalContacts: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contacts, deals, tasks] = await Promise.all([
        contactsService.getAll(),
        dealsService.getAll(),
        tasksService.getAll()
      ]);

      // Calculate stats
      const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
      const activeDeals = deals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage));
      const pendingTasks = tasks.filter(task => task.status !== 'completed');
      const totalRevenue = wonDeals.reduce((total, deal) => total + deal.value, 0);

      setQuickStats({
        totalRevenue,
        activeDeals: activeDeals.length,
        totalContacts: contacts.length,
        pendingTasks: pendingTasks.length
      });

      // Generate recent activity
      const activities = [
        ...deals.slice(0, 3).map(deal => ({
          id: deal.id,
          type: 'deal',
          title: `Deal "${deal.title}" updated`,
          time: '2 hours ago',
          icon: 'Target'
        })),
        ...contacts.slice(0, 2).map(contact => ({
          id: contact.id,
          type: 'contact',
          title: `New contact ${contact.firstName} ${contact.lastName}`,
          time: '4 hours ago',
          icon: 'UserPlus'
        }))
      ];
      setRecentActivity(activities);

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const quickActions = [
    { title: 'Add Contact', icon: 'UserPlus', action: () => navigate('/contacts'), color: 'bg-blue-500' },
    { title: 'Create Deal', icon: 'Target', action: () => navigate('/deals'), color: 'bg-success' },
    { title: 'Schedule Task', icon: 'Calendar', action: () => navigate('/tasks'), color: 'bg-warning' },
    { title: 'View Reports', icon: 'BarChart3', action: () => navigate('/reports'), color: 'bg-secondary' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
        >
          Welcome to PipelineOS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Your centralized CRM platform for managing customers, deals, and sales activities
        </motion.p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: formatCurrency(quickStats.totalRevenue), icon: 'DollarSign', color: 'bg-success' },
          { title: 'Active Deals', value: quickStats.activeDeals, icon: 'Target', color: 'bg-primary' },
          { title: 'Total Contacts', value: quickStats.totalContacts, icon: 'Users', color: 'bg-info' },
          { title: 'Pending Tasks', value: quickStats.pendingTasks, icon: 'Clock', color: 'bg-warning' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                  <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{action.title}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 break-words">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Get Started Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
      >
        <h3 className="text-xl font-heading font-bold mb-2">Get Started with PipelineOS</h3>
        <p className="text-primary-100 mb-4">
          Start by adding your contacts and companies, then create deals to track your sales pipeline
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Add Contacts
          </button>
          <button
            onClick={() => navigate('/deals')}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/30"
          >
            Create Deals
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;