import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Modal from '@/components/molecules/Modal';
import { emailTemplatesService } from '@/services';

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [testEmail, setTestEmail] = useState('');

  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    category: 'general',
    content: '',
    isActive: true
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'welcome', label: 'Welcome' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'newsletter', label: 'Newsletter' }
  ];

  const placeholders = [
    { value: '{{contact.firstName}}', label: 'Contact First Name' },
    { value: '{{contact.lastName}}', label: 'Contact Last Name' },
    { value: '{{contact.email}}', label: 'Contact Email' },
    { value: '{{contact.phone}}', label: 'Contact Phone' },
    { value: '{{contact.company}}', label: 'Contact Company' },
    { value: '{{company.name}}', label: 'Company Name' },
    { value: '{{company.website}}', label: 'Company Website' },
    { value: '{{deal.title}}', label: 'Deal Title' },
    { value: '{{deal.value}}', label: 'Deal Value' },
    { value: '{{deal.stage}}', label: 'Deal Stage' },
    { value: '{{user.name}}', label: 'Your Name' },
    { value: '{{user.email}}', label: 'Your Email' },
    { value: '{{user.signature}}', label: 'Your Signature' },
    { value: '{{date.today}}', label: 'Today\'s Date' },
    { value: '{{date.tomorrow}}', label: 'Tomorrow\'s Date' }
  ];

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emailTemplatesService.getAll();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      toast.error('Failed to load email templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    let filtered = templates;

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory]);

  const resetForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      category: 'general',
      content: '',
      isActive: true
    });
    setEditingTemplate(null);
  };

  const handleCreateTemplate = () => {
    resetForm();
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template) => {
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      category: template.category,
      content: template.content,
      isActive: template.isActive
    });
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = async () => {
    if (!templateForm.name.trim() || !templateForm.subject.trim() || !templateForm.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingTemplate) {
        await emailTemplatesService.update(editingTemplate.id, templateForm);
        toast.success('Template updated successfully');
      } else {
        await emailTemplatesService.create(templateForm);
        toast.success('Template created successfully');
      }
      
      await loadTemplates();
      setShowTemplateModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save template');
    }
  };

  const handleDeleteTemplate = async (template) => {
    if (!window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      await emailTemplatesService.delete(template.id);
      toast.success('Template deleted successfully');
      await loadTemplates();
    } catch (err) {
      toast.error(err.message || 'Failed to delete template');
    }
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast.error('Please enter a test email address');
      return;
    }

    if (!previewTemplate) {
      toast.error('No template selected for testing');
      return;
    }

    try {
      await emailTemplatesService.sendTestEmail(previewTemplate.id, testEmail);
      toast.success(`Test email sent to ${testEmail}`);
      setShowTestEmailModal(false);
      setTestEmail('');
    } catch (err) {
      toast.error(err.message || 'Failed to send test email');
    }
  };

  const insertPlaceholder = (placeholder) => {
    const currentContent = templateForm.content || '';
    setTemplateForm({
      ...templateForm,
      content: currentContent + placeholder
    });
  };

  const renderPreviewContent = (content) => {
    // Replace placeholders with sample data for preview
    const sampleData = {
      '{{contact.firstName}}': 'John',
      '{{contact.lastName}}': 'Doe',
      '{{contact.email}}': 'john.doe@example.com',
      '{{contact.phone}}': '+1 (555) 123-4567',
      '{{contact.company}}': 'ACME Corporation',
      '{{company.name}}': 'ACME Corporation',
      '{{company.website}}': 'www.acme.com',
      '{{deal.title}}': 'Enterprise Software License',
      '{{deal.value}}': '$50,000',
      '{{deal.stage}}': 'Proposal',
      '{{user.name}}': 'Sales Representative',
      '{{user.email}}': 'sales@yourcompany.com',
      '{{user.signature}}': 'Best regards,<br/>Sales Team<br/>Your Company',
      '{{date.today}}': new Date().toLocaleDateString(),
      '{{date.tomorrow}}': new Date(Date.now() + 86400000).toLocaleDateString()
    };

    let previewContent = content;
    Object.entries(sampleData).forEach(([placeholder, value]) => {
      previewContent = previewContent.replace(new RegExp(placeholder, 'g'), value);
    });

    return previewContent;
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load templates</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadTemplates} className="bg-primary text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-bold text-gray-900 mb-2"
          >
            Email Templates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Create and manage email templates for streamlined communication
          </motion.p>
        </div>
        <Button
          onClick={handleCreateTemplate}
          className="bg-primary text-white flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Mail" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'Create your first email template to get started'
            }
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <Button
              onClick={handleCreateTemplate}
              className="bg-primary text-white"
            >
              Create Your First Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 hover:border-primary/30 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {categories.find(c => c.value === template.category)?.label || template.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {template.isActive ? (
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                    ) : (
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  <div dangerouslySetInnerHTML={{ __html: template.content.slice(0, 150) + '...' }} />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                  <span>v{template.version}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 bg-primary text-white"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteTemplate(template)}
                    className="bg-error text-white"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title={editingTemplate ? 'Edit Template' : 'Create New Template'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <Input
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                placeholder="Enter template name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={templateForm.category}
                onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                className="w-full"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line *
            </label>
            <Input
              value={templateForm.subject}
              onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
              placeholder="Enter email subject"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Content *
              </label>
              <Select
                onChange={(e) => insertPlaceholder(e.target.value)}
                value=""
                className="text-sm"
              >
                <option value="">Insert Placeholder</option>
                {placeholders.map(placeholder => (
                  <option key={placeholder.value} value={placeholder.value}>
                    {placeholder.label}
                  </option>
                ))}
              </Select>
            </div>
            <ReactQuill
              theme="snow"
              value={templateForm.content}
              onChange={(content) => setTemplateForm({ ...templateForm, content })}
              modules={quillModules}
              className="bg-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={templateForm.isActive}
              onChange={(e) => setTemplateForm({ ...templateForm, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active template
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={() => setShowTemplateModal(false)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              className="bg-primary text-white"
            >
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={previewTemplate ? `Preview: ${previewTemplate.name}` : 'Template Preview'}
        size="lg"
      >
        {previewTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Subject:</div>
              <div className="text-gray-900">{previewTemplate.subject}</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: renderPreviewContent(previewTemplate.content) }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={() => setShowPreviewModal(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Close
              </Button>
              <Button
                onClick={() => setShowTestEmailModal(true)}
                className="bg-primary text-white"
              >
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Test Email Modal */}
      <Modal
        isOpen={showTestEmailModal}
        onClose={() => setShowTestEmailModal(false)}
        title="Send Test Email"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={() => setShowTestEmailModal(false)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendTestEmail}
              className="bg-primary text-white"
            >
              Send Test Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailTemplatesPage;