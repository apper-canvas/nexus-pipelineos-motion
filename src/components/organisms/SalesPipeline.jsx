import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import DealCard from '@/components/molecules/DealCard';
import { dealsService } from '@/services';
import { toast } from 'react-toastify';

const SalesPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-success' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-error' }
  ];

  const loadDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dealsService.getAll();
      setDeals(result);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealsService.update(draggedDeal.id, {
        ...draggedDeal,
        stage: targetStage
      });
      
      setDeals(prev => prev.map(deal => 
        deal.id === draggedDeal.id ? updatedDeal : deal
      ));
      
      toast.success(`Deal moved to ${stages.find(s => s.id === targetStage)?.name}`);
    } catch (err) {
      toast.error('Failed to update deal');
    } finally {
      setDraggedDeal(null);
    }
  };

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load pipeline</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDeals}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Sales Pipeline
        </h2>
        <p className="text-gray-600">
          Drag and drop deals between stages to update their status
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageValue = stageDeals.reduce((total, deal) => total + deal.value, 0);

            return (
              <motion.div
                key={stage.id}
                className="bg-white rounded-lg border border-gray-200 w-80 flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{stage.name}</h3>
                    <span className={`w-3 h-3 rounded-full ${stage.color}`}></span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stageDeals.length} deals • {formatCurrency(stageValue)}
                  </div>
                </div>

                <div
                  className="p-4 min-h-96 space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDragStart={handleDragStart}
                      draggedDeal={draggedDeal}
                      formatCurrency={formatCurrency}
                    />
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Drop deals here</p>
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

export default SalesPipeline;