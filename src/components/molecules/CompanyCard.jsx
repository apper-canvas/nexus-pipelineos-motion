import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CompanyCard = ({ company, contacts, onEdit, onDelete, formatRevenue, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium text-gray-900 break-words mb-1">
            {company.name}
          </h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
            {company.industry}
          </span>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <Button
            onClick={() => onEdit(company)}
            className="p-1 text-gray-400 hover:text-primary transition-colors bg-transparent"
            icon={<ApperIcon name="Edit" className="w-4 h-4" />}
          />
          <Button
            onClick={() => onDelete(company.id)}
            className="p-1 text-gray-400 hover:text-error transition-colors bg-transparent"
            icon={<ApperIcon name="Trash2" className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <ApperIcon name="Users" className="w-4 h-4 mr-2 text-gray-400" />
          <span>{company.size} employees</span>
        </div>
        
        {company.website && (
          <div className="flex items-center">
            <ApperIcon name="Globe" className="w-4 h-4 mr-2 text-gray-400" />
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-words"
            >
              {company.website}
            </a>
          </div>
        )}
        
        <div className="flex items-center">
          <ApperIcon name="DollarSign" className="w-4 h-4 mr-2 text-gray-400" />
          <span>{formatRevenue(company.annualRevenue)}</span>
        </div>
        
        <div className="flex items-center">
          <ApperIcon name="Contact" className="w-4 h-4 mr-2 text-gray-400" />
          <span>{contacts.length} contacts</span>
        </div>
      </div>

      {contacts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-500 mb-2">KEY CONTACTS</h4>
          <div className="space-y-2">
            {contacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">
                    {contact.firstName[0]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-900 break-words">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-xs text-gray-500 break-words">
                    {contact.position}
                  </p>
                </div>
              </div>
            ))}
            {contacts.length > 3 && (
              <p className="text-xs text-gray-500">
                +{contacts.length - 3} more
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyCard;