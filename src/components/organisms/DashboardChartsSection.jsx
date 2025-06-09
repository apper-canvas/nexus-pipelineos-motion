import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const DashboardChartsSection = ({ chartData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Distribution</h3>
        <Chart
          options={chartData.pipeline.options}
          series={chartData.pipeline.series}
          type="donut"
          height={300}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
        <Chart
          options={chartData.revenue.options}
          series={chartData.revenue.series}
          type="area"
          height={300}
        />
      </motion.div>
    </div>
  );
};

export default DashboardChartsSection;