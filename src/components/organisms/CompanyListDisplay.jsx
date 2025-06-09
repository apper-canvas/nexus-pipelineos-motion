import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import CompanyCard from '@/components/molecules/CompanyCard';

const CompanyListDisplay = ({ companies, contacts, searchTerm, setSearchTerm, onEdit, onDelete, onCreate }) => {
  const formatRevenue = (revenue) => {
    if (!revenue) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(revenue);
  };

  const getCompanyContacts = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Building2" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No companies found' : 'No companies yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first company'}
          </p>
          {!searchTerm && (
            <Button
              onClick={onCreate}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Add Company
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              contacts={getCompanyContacts(company.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              formatRevenue={formatRevenue}
              delay={index * 0.1}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CompanyListDisplay;