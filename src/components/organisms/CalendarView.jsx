import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskItem from '@/components/molecules/TaskItem'; // Assuming TaskItem is used for little bars

const CalendarView = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, getTasksForDate, getPriorityColor }) => {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDayIndex = monthStart.getDay(); // 0 for Sunday, 6 for Saturday
  const totalDaysInMonth = monthEnd.getDate();

  const calendarDays = [];
  // Add leading empty days
  for (let i = 0; i < startDayIndex; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }
  // Add trailing empty days to complete the last week row
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-20 bg-gray-50 rounded"></div>;
            }
            const dayTasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDate(day)}
                className={`min-h-20 p-2 border border-gray-200 rounded cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/10 border-primary' :
                  isToday ? 'bg-accent/10 border-accent' :
                  !isSameMonth(day, currentDate) ? 'bg-gray-50 text-gray-400' :
                  'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`w-full h-1 rounded ${getPriorityColor(task.priority)}`}
                    />
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;