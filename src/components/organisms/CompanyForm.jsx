import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const CompanyForm = ({ formData, setFormData, handleSubmit, handleCloseModal, editingCompany }) => {
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Real Estate', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Company Name"
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />

      <FormField
        label="Industry"
        type="select"
        required
        value={formData.industry}
        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
        options={industries.map(i => ({ value: i, label: i }))}
        placeholder="Select Industry"
      />

      <FormField
        label="Company Size"
        type="select"
        required
        value={formData.size}
        onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
        options={companySizes.map(s => ({ value: s, label: `${s} employees` }))}
        placeholder="Select Size"
      />

      <FormField
        label="Website"
        type="url"
        value={formData.website}
        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
        placeholder="https://example.com"
      />

      <FormField
        label="Annual Revenue ($)"
        type="number"
        value={formData.annualRevenue}
        onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: e.target.value }))}
        placeholder="1000000"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={handleCloseModal}
          className="text-gray-700 border border-gray-300 hover:bg-gray-50 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-primary/90"
        >
          {editingCompany ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;