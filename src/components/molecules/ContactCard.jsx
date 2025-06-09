import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ContactCard = ({ contact, getCompanyName, onEdit, onDelete, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-sm">
              {contact.firstName[0]}{contact.lastName[0]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900 break-words">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-gray-600 break-words">{contact.email}</p>
            <div className="flex flex-wrap items-center space-x-4 text-xs text-gray-500 mt-1">
              <span>{contact.position}</span>
              <span>{getCompanyName(contact.companyId)}</span>
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            onClick={() => onEdit(contact)}
            className="p-2 text-gray-400 hover:text-primary transition-colors bg-transparent"
            icon={<ApperIcon name="Edit" className="w-4 h-4" />}
          />
          <Button
            onClick={() => onDelete(contact.id)}
            className="p-2 text-gray-400 hover:text-error transition-colors bg-transparent"
            icon={<ApperIcon name="Trash2" className="w-4 h-4" />}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;