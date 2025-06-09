import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardMetricsSection = ({ metrics, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        icon="DollarSign"
        color="bg-success"
        trend="+12.5%"
        delay={0}
      />
      <MetricCard
        title="Deals Won"
        value={metrics.dealsWon}
        icon="TrendingUp"
        color="bg-primary"
        trend="+8.2%"
        delay={0.1}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        icon="Target"
        color="bg-secondary"
        trend="+3.1%"
        delay={0.2}
      />
      <MetricCard
        title="Total Contacts"
        value={metrics.totalContacts}
        icon="Users"
        color="bg-info"
        delay={0.3}
      />
      <MetricCard
        title="Active Tasks"
        value={metrics.activeTasks}
        icon="CheckSquare"
        color="bg-warning"
        delay={0.4}
      />
      <MetricCard
        title="Deals Lost"
        value={metrics.dealsLost}
        icon="TrendingDown"
        color="bg-error"
        delay={0.5}
      />
    </div>
  );
};

export default DashboardMetricsSection;