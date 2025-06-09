import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import ContactForm from '@/components/organisms/ContactForm';
import ContactListDisplay from '@/components/organisms/ContactListDisplay';
import { contactsService, companiesService } from '@/services';
import { toast } from 'react-toastify';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyId: '',
    position: '',
    tags: []
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyId: '',
      position: '',
      tags: []
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        const updated = await contactsService.update(editingContact.id, formData);
        setContacts(prev => prev.map(c => c.id === editingContact.id ? updated : c));
        toast.success('Contact updated successfully');
      } else {
        const newContact = await contactsService.create({
          ...formData,
          lastContacted: new Date().toISOString()
        });
        setContacts(prev => [...prev, newContact]);
        toast.success('Contact created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = useCallback((contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowModal(true);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactsService.delete(id);
        setContacts(prev => prev.filter(c => c.id !== id));
        toast.success('Contact deleted successfully');
      } catch (err) {
        toast.error('Failed to delete contact');
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
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load contacts</h3>
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your contact database</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white hover:bg-primary/90"
          icon={<ApperIcon name="Plus" className="w-4 h-4" />}
        >
          Add Contact
        </Button>
      </div>

      <ContactListDisplay
        contacts={contacts}
        companies={companies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() => setShowModal(true)}
      />

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
      >
        <ContactForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          editingContact={editingContact}
          companies={companies}
        />
      </Modal>
    </div>
  );
};

export default ContactsPage;