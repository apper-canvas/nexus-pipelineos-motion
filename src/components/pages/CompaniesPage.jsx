import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import CompanyForm from '@/components/organisms/CompanyForm';
import CompanyListDisplay from '@/components/organisms/CompanyListDisplay';
import { companiesService, contactsService } from '@/services';
import { toast } from 'react-toastify';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    annualRevenue: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [companiesData, contactsData] = await Promise.all([
        companiesService.getAll(),
        contactsService.getAll()
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: '',
      size: '',
      website: '',
      annualRevenue: ''
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        annualRevenue: formData.annualRevenue ? Number(formData.annualRevenue) : 0
      };

      if (editingCompany) {
        const updated = await companiesService.update(editingCompany.id, dataToSubmit);
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? updated : c));
        toast.success('Company updated successfully');
      } else {
        const newCompany = await companiesService.create(dataToSubmit);
        setCompanies(prev => [...prev, newCompany]);
        toast.success('Company created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to save company');
    }
  };

  const handleEdit = useCallback((company) => {
    setEditingCompany(company);
    setFormData({
      ...company,
      annualRevenue: company.annualRevenue ? company.annualRevenue.toString() : ''
    });
    setShowModal(true);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await companiesService.delete(id);
        setCompanies(prev => prev.filter(c => c.id !== id));
        toast.success('Company deleted successfully');
      } catch (err) {
        toast.error('Failed to delete company');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load companies</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={loadData}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Manage your company database</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white hover:bg-primary/90"
          icon={<ApperIcon name="Plus" className="w-4 h-4" />}
        >
          Add Company
        </Button>
      </div>

      <CompanyListDisplay
        companies={companies}
        contacts={contacts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() => setShowModal(true)}
      />

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingCompany ? 'Edit Company' : 'Add Company'}
      >
        <CompanyForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          editingCompany={editingCompany}
        />
      </Modal>
    </div>
  );
};

export default CompaniesPage;