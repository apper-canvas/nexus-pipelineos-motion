import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { dealsService } from '@/services';
import { toast } from 'react-toastify';

const DealForm = ({ onSuccess, onCancel, deal = null }) => {
  const isEditing = !!deal;
  
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    company: deal?.company || '',
    value: deal?.value || '',
    stage: deal?.stage || 'lead',
    probability: deal?.probability || 10,
    closeDate: deal?.closeDate ? deal.closeDate.split('T')[0] : '',
    owner: deal?.owner || 'John Doe',
    description: deal?.description || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    if (!formData.closeDate) {
      newErrors.closeDate = 'Expected close date is required';
    } else {
      const closeDate = new Date(formData.closeDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (closeDate < today) {
        newErrors.closeDate = 'Close date cannot be in the past';
      }
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        closeDate: new Date(formData.closeDate).toISOString()
      };

      if (isEditing) {
        await dealsService.update(deal.id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await dealsService.create(dealData);
        toast.success('Deal created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update deal' : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Name"
          error={errors.name}
          required
        >
<Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-error' : ''}
            placeholder="Enter deal name"
            aria-describedby={errors.name ? 'name-error' : undefined}
required
          />
        </FormField>

        <FormField
          label="Company"
          error={errors.company}
          required
        >
          <Input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className={errors.company ? 'border-error' : ''}
            placeholder="Enter company name"
            aria-describedby={errors.company ? 'company-error' : undefined}
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Value ($)"
          error={errors.value}
          required
        >
<Input
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => handleChange('value', e.target.value)}
            className={errors.value ? 'border-error' : ''}
            placeholder="0.00"
            aria-describedby={errors.value ? 'value-error' : undefined}
            required
          />

        <FormField
          label="Stage"
          error={errors.stage}
        >
          <select
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {stages.map(stage => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Probability (%)"
          error={errors.probability}
        >
<Input
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleChange('probability', e.target.value)}
            className={errors.probability ? 'border-error' : ''}
            placeholder="10"
            aria-describedby={errors.probability ? 'probability-error' : undefined}
          />

        <FormField
          label="Expected Close Date"
          error={errors.closeDate}
          required
        >
<Input
            type="date"
            value={formData.closeDate}
            onChange={(e) => handleChange('closeDate', e.target.value)}
            className={errors.closeDate ? 'border-error' : ''}
            aria-describedby={errors.closeDate ? 'closeDate-error' : undefined}
            required
          />
      </div>

      <FormField
        label="Deal Owner"
        error={errors.owner}
      >
<Input
          type="text"
          value={formData.owner}
onChange={(e) => handleChange('owner', e.target.value)}
          placeholder="Enter deal owner"
        />
      </FormField>

      <FormField
        label="Description"
        error={errors.description}
      >
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="Enter deal description (optional)"
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="min-w-24"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Deal' : 'Create Deal')}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;