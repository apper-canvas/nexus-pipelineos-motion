import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ContactCard from '@/components/molecules/ContactCard';

const ContactListDisplay = ({ contacts, companies, searchTerm, setSearchTerm, onEdit, onDelete, onCreate }) => {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-x-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
            </p>
            {!searchTerm && (
              <Button
                onClick={onCreate}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Add Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact, index) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                getCompanyName={getCompanyName}
                onEdit={onEdit}
                onDelete={onDelete}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactListDisplay;