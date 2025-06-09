import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ContactForm = ({ formData, setFormData, handleSubmit, handleCloseModal, editingContact, companies }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          type="text"
          required
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
        />
        <FormField
          label="Last Name"
          type="text"
          required
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
        />
      </div>

      <FormField
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />

      <FormField
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
      />

      <FormField
        label="Company"
        type="select"
        value={formData.companyId}
        onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
        options={companies.map(company => ({ value: company.id, label: company.name }))}
        placeholder="Select Company"
      />

      <FormField
        label="Position"
        type="text"
        value={formData.position}
        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
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
          {editingContact ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;