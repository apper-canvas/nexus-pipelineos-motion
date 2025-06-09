import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const GetStartedBanner = ({ onAddContacts, onCreateDeals }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
    >
      <h3 className="text-xl font-heading font-bold mb-2">Get Started with PipelineOS</h3>
      <p className="text-primary-100 mb-4">
        Start by adding your contacts and companies, then create deals to track your sales pipeline
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onAddContacts}
          className="bg-white text-primary hover:bg-gray-100 font-medium"
        >
          Add Contacts
        </Button>
        <Button
          onClick={onCreateDeals}
          className="bg-white/20 text-white hover:bg-white/30 font-medium border border-white/30"
        >
          Create Deals
        </Button>
      </div>
    </motion.div>
  );
};

export default GetStartedBanner;