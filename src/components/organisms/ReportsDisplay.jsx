import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ReportSelectionCard from '@/components/molecules/ReportSelectionCard';

const ReportsDisplay = ({ data, reportTypes, selectedReport, setSelectedReport }) => {
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

  return (
    <>
      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reportTypes.map((report, index) => (
          <ReportSelectionCard
            key={report.id}
            id={report.id}
            label={report.label}
            icon={report.icon}
            isSelected={selectedReport === report.id}
            onClick={setSelectedReport}
            delay={index * 0.1}
          />
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
    </>
  );
};

export default ReportsDisplay;