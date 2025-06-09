import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ActivityItem from '@/components/molecules/ActivityItem';

const RecentActivitySection = ({ recentActivity }) => {
  return (
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
            <ActivityItem 
              key={`${activity?.id || 'unknown'}-${index}`} 
              activity={activity} 
              delay={0.6 + index * 0.1} 
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivitySection;