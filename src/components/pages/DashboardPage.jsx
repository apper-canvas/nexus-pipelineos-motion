import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import DashboardMetricsSection from '@/components/organisms/DashboardMetricsSection';
import DashboardChartsSection from '@/components/organisms/DashboardChartsSection';
import { contactsService, dealsService, tasksService } from '@/services';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    dealsWon: 0,
    dealsLost: 0,
    conversionRate: 0,
    totalContacts: 0,
    activeTasks: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    pipeline: {
      series: [],
      options: {
        chart: { type: 'donut', height: 300 },
        labels: [],
        colors: ['#5B21B6', '#7C3AED', '#F59E0B', '#EF4444', '#10B981'],
        legend: { position: 'bottom' },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }]
      }
    },
    revenue: {
      series: [{
        name: 'Revenue',
        data: [65000, 78000, 82000, 91000, 98000, 105000]
      }],
      options: {
        chart: { type: 'area', height: 300 },
        colors: ['#5B21B6'],
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        }
      }
    }
  });

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [contacts, deals, tasks] = await Promise.all([
        contactsService.getAll(),
        dealsService.getAll(),
        tasksService.getAll()
      ]);

      // Calculate metrics
      const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
      const lostDeals = deals.filter(deal => deal.stage === 'closed-lost');
      const totalRevenue = wonDeals.reduce((total, deal) => total + deal.value, 0);
      const totalDeals = wonDeals.length + lostDeals.length;
      const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;
      const activeTasks = tasks.filter(task => task.status !== 'completed').length;

      setMetrics({
        totalRevenue,
        dealsWon: wonDeals.length,
        dealsLost: lostDeals.length,
        conversionRate,
        totalContacts: contacts.length,
        activeTasks
      });

      // Update pipeline chart
      const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won'];
      const pipelineData = stages.map(stage => 
        deals.filter(deal => deal.stage === stage).length
      );
      
      setChartData(prev => ({
        ...prev,
        pipeline: {
          ...prev.pipeline,
          series: pipelineData,
          options: {
            ...prev.pipeline.options,
            labels: ['Leads', 'Qualified', 'Proposals', 'Negotiation', 'Closed Won']
          }
        }
      }));

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
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
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Sales Dashboard
        </h1>
        <p className="text-gray-600">Track your sales performance and key metrics</p>
      </div>

      <DashboardMetricsSection metrics={metrics} formatCurrency={formatCurrency} />
      <DashboardChartsSection chartData={chartData} />
    </div>
  );
};

export default DashboardPage;