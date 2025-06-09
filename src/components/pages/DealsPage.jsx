import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import DealForm from '@/components/organisms/DealForm';
import DealCard from '@/components/molecules/DealCard';
import { dealsService } from '@/services';
import { toast } from 'react-toastify';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const stages = [
    { value: 'all', label: 'All Stages' },
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const stageColors = {
    'lead': 'bg-gray-100 text-gray-800',
    'qualified': 'bg-blue-100 text-blue-800',
    'proposal': 'bg-yellow-100 text-yellow-800',
    'negotiation': 'bg-orange-100 text-orange-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await dealsService.getAll();
      setDeals(data);
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowAddModal(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setShowViewModal(true);
  };

  const handleDeleteDeal = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete "${deal.name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(deal.id);
      await dealsService.delete(deal.id);
      toast.success('Deal deleted successfully');
      loadDeals();
    } catch (error) {
      toast.error('Failed to delete deal');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedDeal(null);
    loadDeals();
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedDeal(null);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
  const totalWonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600">Manage your sales pipeline and track deal progress</p>
        </div>
        <Button
          onClick={handleAddDeal}
          className="flex items-center gap-2"
          variant="primary"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won Deals</p>
              <p className="text-2xl font-bold text-gray-900">{wonDeals.length}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWonValue)}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white"
              >
                {stages.map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStage !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first deal.'
              }
            </p>
            {!searchTerm && filterStage === 'all' && (
              <div className="mt-6">
                <Button onClick={handleAddDeal} variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredDeals.map((deal, index) => (
                    <motion.tr
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                        <div className="text-sm text-gray-500">{deal.probability}% probability</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stageColors[deal.stage]}`}>
                          {stages.find(s => s.value === deal.stage)?.label || deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(deal.closeDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deal.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDeal(deal)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="View Deal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditDeal(deal)}
                            className="text-primary hover:text-secondary p-1"
                            title="Edit Deal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDeal(deal)}
                            disabled={deleteLoading === deal.id}
                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                            title="Delete Deal"
                          >
                            {deleteLoading === deal.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModals}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          onSuccess={handleFormSuccess}
          onCancel={handleCloseModals}
        />
      </Modal>

      {/* Edit Deal Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        title="Edit Deal"
        size="lg"
      >
        {selectedDeal && (
          <DealForm
            deal={selectedDeal}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModals}
          />
        )}
      </Modal>

      {/* View Deal Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={handleCloseModals}
        title="Deal Details"
        size="lg"
      >
        {selectedDeal && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
                <p className="text-sm text-gray-900">{selectedDeal.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <p className="text-sm text-gray-900">{selectedDeal.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedDeal.value)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stageColors[selectedDeal.stage]}`}>
                  {stages.find(s => s.value === selectedDeal.stage)?.label || selectedDeal.stage}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
                <p className="text-sm text-gray-900">{selectedDeal.probability}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Date</label>
                <p className="text-sm text-gray-900">{formatDate(selectedDeal.closeDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                <p className="text-sm text-gray-900">{selectedDeal.owner}</p>
              </div>
            </div>
            {selectedDeal.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{selectedDeal.description}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={handleCloseModals}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditDeal(selectedDeal);
                }}
              >
                Edit Deal
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DealsPage;