import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskItem from '@/components/molecules/TaskItem';
import Button from '@/components/atoms/Button';

const TaskListForDate = ({ selectedDate, selectedDateTasks, getPriorityColor, handleToggleStatus, onEdit, onDelete, onAddTask }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {format(selectedDate, 'MMM d, yyyy')}
        </h3>
        <p className="text-sm text-gray-600">
          {selectedDateTasks.length} tasks
        </p>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {selectedDateTasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No tasks for this date</p>
            <Button
              onClick={onAddTask}
              className="mt-2 text-sm text-primary hover:underline bg-transparent px-0 py-0"
            >
              Add a task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                getPriorityColor={getPriorityColor}
                handleToggleStatus={handleToggleStatus}
                onEdit={onEdit}
                onDelete={onDelete}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListForDate;