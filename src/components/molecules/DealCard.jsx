import React from 'react';
import { motion } from 'framer-motion';

const DealCard = ({ deal, onDragStart, draggedDeal, formatCurrency }) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      className={`bg-gray-50 rounded-lg p-3 cursor-move border border-gray-200 hover:shadow-md transition-shadow ${
        draggedDeal?.id === deal.id ? 'opacity-50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm break-words">
          {deal.title}
        </h4>
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
          {deal.probability}%
        </span>
      </div>
      <div className="text-lg font-bold text-primary mb-2">
        {formatCurrency(deal.value)}
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <div>Owner: {deal.owner}</div>
        <div>Close: {new Date(deal.closeDate).toLocaleDateString()}</div>
      </div>
    </motion.div>
  );
};

export default DealCard;