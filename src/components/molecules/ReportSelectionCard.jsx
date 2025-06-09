import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ReportSelectionCard = ({ id, label, icon, isSelected, onClick, delay = 0 }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => onClick(id)}
      className={`p-4 rounded-lg border transition-all text-left ${
        isSelected
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-3">
        <ApperIcon 
          name={icon} 
          className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} 
        />
        <span className="font-medium">{label}</span>
      </div>
    </motion.button>
  );
};

export default ReportSelectionCard;