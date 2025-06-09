import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button'; // Assuming Button is used

const QuickActionsSection = ({ quickActions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={action.title}
            onClick={action.action}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all bg-transparent flex flex-col items-start"
            style={{ padding: '1rem' }} // Ensure consistent padding for internal content
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 flex-shrink-0`}
            >
              <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
            </motion.div>
            <p className="font-medium text-gray-900 text-sm">{action.title}</p>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActionsSection;