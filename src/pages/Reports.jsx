import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { contactsService, dealsService, tasksService } from '../services';
import { toast } from 'react-toastify';

const Reports = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('sales-funnel');

  const reportTypes = [
    { id: 'sales-funnel', label: 'Sales Funnel', icon: 'TrendingUp' },
    { id: 'revenue-trend', label: 'Revenue Trend', icon: 'DollarSign' },
    { id: 'task-completion', label: 'Task Completion', icon: 'CheckSquare' },
    { id: 'contact-activity', label: 'Contact Activity', icon: 'Users' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contacts, deals, tasks] = await Promise.all([
        contactsService.getAll(),
        dealsService.getAll(),
        tasksService.getAll()
      ]);
      setData({ contacts, deals, tasks });
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const generateSalesFunnelData = () => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won'];
    const stageLabels = ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    const stageCounts = stages.map(stage => 
      data.deals.filter(deal => deal.stage === stage).length
    );

    return {
      series: stageCounts,
      options: {
        chart: { type: 'donut', height: 400 },
        labels: stageLabels,
        colors: ['#6B7280', '#3B82F6', '#F59E0B', '#EF4444', '#10B981'],
        legend: { position: 'bottom' },
        plotOptions: {
          pie: {
            donut: {
              size: '60%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Deals',
                  formatter: () => data.deals.length
                }
              }
            }
          }
        }
      }
    };
  };

  const generateRevenueTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueData = [85000, 92000, 78000, 105000, 118000, 135000];

    return {
      series: [{
        name: 'Revenue',
        data: revenueData
      }],
      options: {
        chart: { type: 'line', height: 400 },
        colors: ['#5B21B6'],
        xaxis: { categories: months },
        yaxis: {
          labels: {
            formatter: (value) => `$${(value / 1000).toFixed(0)}K`
          }
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 6 },
        grid: { borderColor: '#E5E7EB' }
      }
    };
  };

  const generateTaskCompletionData = () => {
    const completedTasks = data.tasks.filter(task => task.status === 'completed').length;
    const totalTasks = data.tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      series: [completionRate],
      options: {
        chart: { type: 'radialBar', height: 400 },
        colors: ['#10B981'],
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: {
              name: { show: false },
              value: {
                fontSize: '24px',
                fontWeight: 'bold',
                formatter: (val) => `${val.toFixed(1)}%`
              }
            }
          }
        },
        labels: ['Task Completion Rate']
      }
    };
  };

  const generateContactActivityData = () => {
    const activityData = [
      { name: 'New Contacts', value: data.contacts.length },
      { name: 'Active Deals', value: data.deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length },
      { name: 'Pending Tasks', value: data.tasks.filter(t => t.status === 'pending').length }
    ];

    return {
      series: [{
        name: 'Count',
        data: activityData.map(item => item.value)
      }],
      options: {
        chart: { type: 'bar', height: 400 },
        colors: ['#7C3AED'],
        xaxis: { categories: activityData.map(item => item.name) },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false
          }
        },
        grid: { borderColor: '#E5E7EB' }
      }
    };
  };

  const exportReport = () => {
    const reportData = {
      type: selectedReport,
      generatedAt: new Date().toISOString(),
      data: data
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const renderChart = () => {
    switch (selectedReport) {
      case 'sales-funnel':
        const funnelData = generateSalesFunnelData();
        return (
          <Chart
            options={funnelData.options}
            series={funnelData.series}
            type="donut"
            height={400}
          />
        );
      case 'revenue-trend':
        const revenueData = generateRevenueTrendData();
        return (
          <Chart
            options={revenueData.options}
            series={revenueData.series}
            type="line"
            height={400}
          />
        );
      case 'task-completion':
        const taskData = generateTaskCompletionData();
        return (
          <Chart
            options={taskData.options}
            series={taskData.series}
            type="radialBar"
            height={400}
          />
        );
      case 'contact-activity':
        const activityData = generateContactActivityData();
        return (
          <Chart
            options={activityData.options}
            series={activityData.series}
            type="bar"
            height={400}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load reports</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your sales performance and metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportReport}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Download" className="w-4 h-4" />
          <span>Export Report</span>
        </motion.button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reportTypes.map((report, index) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selectedReport === report.id
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={report.icon} 
                className={`w-5 h-5 ${selectedReport === report.id ? 'text-white' : 'text-primary'}`} 
              />
              <span className="font-medium">{report.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chart Display */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {reportTypes.find(r => r.id === selectedReport)?.label}
          </h2>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="h-96">
          {renderChart()}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{data.deals.length}</div>
              <div className="text-sm text-gray-600">Total Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {data.deals.filter(d => d.stage === 'closed-won').length}
              </div>
              <div className="text-sm text-gray-600">Won Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{data.contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {data.tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;