import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskItem = ({ task, getPriorityColor, handleToggleStatus, onEdit, onDelete, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 break-words">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <Button
            onClick={() => handleToggleStatus(task)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors bg-transparent ${
              task.status === 'completed'
                ? 'bg-success border-success'
                : 'border-gray-300 hover:border-success'
            }`}
            icon={task.status === 'completed' ? <ApperIcon name="Check" className="w-3 h-3 text-white" /> : null}
          />
          <Button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-primary transition-colors bg-transparent"
            icon={<ApperIcon name="Edit" className="w-3 h-3" />}
          />
          <Button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-error transition-colors bg-transparent"
            icon={<ApperIcon name="Trash2" className="w-3 h-3" />}
          />
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 break-words">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          <span className="text-xs text-gray-500">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {format(new Date(task.dueDate), 'h:mm a')}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskItem;