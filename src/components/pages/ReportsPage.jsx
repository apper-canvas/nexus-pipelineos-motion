import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ReportsDisplay from '@/components/organisms/ReportsDisplay';
import { contactsService, dealsService, tasksService } from '@/services';
import { toast } from 'react-toastify';

const ReportsPage = () => {
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

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your sales performance and metrics</p>
        </div>
        <Button
          onClick={exportReport}
          className="bg-accent text-white hover:bg-accent/90"
          icon={<ApperIcon name="Download" className="w-4 h-4" />}
        >
          Export Report
        </Button>
      </div>

      <ReportsDisplay
        data={data}
        reportTypes={reportTypes}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />
    </div>
  );
};

export default ReportsPage;