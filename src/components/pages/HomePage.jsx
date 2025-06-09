import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MetricCard from '@/components/molecules/MetricCard';
import QuickActionsSection from '@/components/organisms/QuickActionsSection';
import RecentActivitySection from '@/components/organisms/RecentActivitySection';
import GetStartedBanner from '@/components/organisms/GetStartedBanner';
import ApperIcon from '@/components/ApperIcon';
import { contactsService, dealsService, tasksService } from '@/services';
import { toast } from 'react-toastify';

const HomePage = () => {
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

  const loadDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
    { title: 'Email Templates', icon: 'Mail', action: () => navigate('/email-templates'), color: 'bg-purple-500' },
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
        <MetricCard title="Total Revenue" value={formatCurrency(quickStats.totalRevenue)} icon="DollarSign" color="bg-success" delay={0.1} />
        <MetricCard title="Active Deals" value={quickStats.activeDeals} icon="Target" color="bg-primary" delay={0.2} />
        <MetricCard title="Total Contacts" value={quickStats.totalContacts} icon="Users" color="bg-info" delay={0.3} />
        <MetricCard title="Pending Tasks" value={quickStats.pendingTasks} icon="Clock" color="bg-warning" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <QuickActionsSection quickActions={quickActions} />

        {/* Recent Activity */}
        <RecentActivitySection recentActivity={recentActivity} />
      </div>

      {/* Get Started Section */}
      <GetStartedBanner
        onAddContacts={() => navigate('/contacts')}
        onCreateDeals={() => navigate('/deals')}
      />
    </div>
  );
};

export default HomePage;