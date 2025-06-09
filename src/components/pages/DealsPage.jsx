import React, { useState } from 'react';
import SalesPipeline from '@/components/organisms/SalesPipeline';
import Modal from '@/components/molecules/Modal';
import DealForm from '@/components/organisms/DealForm';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DealsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDealAdded = () => {
    setShowAddModal(false);
    // The SalesPipeline component will automatically refresh via its loadDeals callback
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Deals
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your sales pipeline and track deal progress
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="flex items-center gap-2"
              aria-label="Add new deal"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Deal
            </Button>
          </div>
        </div>
        <SalesPipeline key={showAddModal ? 'refresh' : 'normal'} />
      </div>

      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Deal"
      >
        <DealForm
          onSuccess={handleDealAdded}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default DealsPage;