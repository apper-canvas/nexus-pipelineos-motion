import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ActivityItem = ({ activity, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
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
  );
};

export default ActivityItem;