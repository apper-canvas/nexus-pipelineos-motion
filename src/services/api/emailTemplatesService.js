export const emailTemplatesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", 
          "ModifiedBy", "subject", "category", "content", "is_active", 
          "version", "created_at", "updated_at", "sent", "opened", 
          "clicked", "open_rate", "click_rate"
        ]
      };

      const response = await apperClient.fetchRecords('email_template', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch email templates');
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching email templates:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", 
          "ModifiedBy", "subject", "category", "content", "is_active", 
          "version", "created_at", "updated_at", "sent", "opened", 
          "clicked", "open_rate", "click_rate"
        ]
      };

      const response = await apperClient.getRecordById('email_template', id, params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch email template');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching email template with ID ${id}:`, error);
      throw error;
    }
  },

  async create(templateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const createData = {
        Name: templateData.name,
        Tags: templateData.tags || "",
        Owner: templateData.owner,
        subject: templateData.subject,
        category: templateData.category,
        content: templateData.content,
        is_active: templateData.isActive !== undefined ? templateData.isActive : true,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sent: 0,
        opened: 0,
        clicked: 0,
        open_rate: 0.0,
        click_rate: 0.0
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('email_template', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to create email template');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating email template:", error);
      throw error;
    }
  },

  async update(id, templateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        Name: templateData.name,
        Tags: templateData.tags || "",
        Owner: templateData.owner,
        subject: templateData.subject,
        category: templateData.category,
        content: templateData.content,
        is_active: templateData.isActive,
        version: templateData.version || 1,
        updated_at: new Date().toISOString(),
        sent: templateData.sent || 0,
        opened: templateData.opened || 0,
        clicked: templateData.clicked || 0,
        open_rate: templateData.openRate || 0.0,
        click_rate: templateData.clickRate || 0.0
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('email_template', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to update email template');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('email_template', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to delete email template');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting email template:", error);
      throw error;
    }
  },

  async sendTestEmail(templateId, testEmail) {
    // This would typically integrate with email service
    console.log(`Sending test email to ${testEmail} with template ID: ${templateId}`);
    
    return {
      success: true,
      message: `Test email sent to ${testEmail}`,
      templateId,
      sentAt: new Date().toISOString()
    };
  },

  async renderTemplate(templateId, data = {}) {
    try {
      const template = await this.getById(templateId);
      
      // Default placeholder data
      const defaultData = {
        contact: {
          firstName: data.contact?.firstName || '',
          lastName: data.contact?.lastName || '',
          email: data.contact?.email || '',
          phone: data.contact?.phone || '',
          company: data.contact?.company || ''
        },
        company: {
          name: data.company?.name || '',
          website: data.company?.website || ''
        },
        deal: {
          title: data.deal?.title || '',
          value: data.deal?.value || '',
          stage: data.deal?.stage || ''
        },
        user: {
          name: data.user?.name || 'Sales Representative',
          email: data.user?.email || 'sales@yourcompany.com',
          signature: data.user?.signature || 'Best regards,<br/>Sales Team'
        },
        date: {
          today: new Date().toLocaleDateString(),
          tomorrow: new Date(Date.now() + 86400000).toLocaleDateString()
        }
      };
      
      // Replace placeholders in subject and content
      let renderedSubject = template.subject;
      let renderedContent = template.content;
      
      const replacePlaceholders = (text, placeholderData) => {
        let result = text;
        
        Object.entries(placeholderData).forEach(([key, value]) => {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              const placeholder = `{{${key}.${subKey}}}`;
              result = result.replace(new RegExp(placeholder, 'g'), subValue);
            });
          } else {
            const placeholder = `{{${key}}}`;
            result = result.replace(new RegExp(placeholder, 'g'), value);
          }
        });
        
        return result;
      };
      
      renderedSubject = replacePlaceholders(renderedSubject, defaultData);
      renderedContent = replacePlaceholders(renderedContent, defaultData);
      
      return {
        subject: renderedSubject,
        content: renderedContent,
        templateId: template.Id,
        templateName: template.Name
      };
    } catch (error) {
      console.error("Error rendering template:", error);
      throw error;
    }
  }
};

export default emailTemplatesService;