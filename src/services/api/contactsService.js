const contactsService = {
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
          "ModifiedBy", "first_name", "last_name", "email", "phone", 
          "position", "last_contacted", "company_id"
        ]
      };

      const response = await apperClient.fetchRecords('contact', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch contacts');
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
          "ModifiedBy", "first_name", "last_name", "email", "phone", 
          "position", "last_contacted", "company_id"
        ]
      };

      const response = await apperClient.getRecordById('contact', id, params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch contact');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const createData = {
        Name: `${contactData.firstName} ${contactData.lastName}`,
        Tags: contactData.tags?.join(',') || "",
        Owner: contactData.owner,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        position: contactData.position,
        last_contacted: contactData.lastContacted || new Date().toISOString(),
        company_id: contactData.companyId ? parseInt(contactData.companyId) : null
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('contact', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to create contact');
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
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        Name: `${contactData.firstName} ${contactData.lastName}`,
        Tags: contactData.tags?.join(',') || "",
        Owner: contactData.owner,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        position: contactData.position,
        last_contacted: contactData.lastContacted || new Date().toISOString(),
        company_id: contactData.companyId ? parseInt(contactData.companyId) : null
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('contact', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to update contact');
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
      console.error("Error updating contact:", error);
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

      const response = await apperClient.deleteRecord('contact', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to delete contact');
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
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

export { contactsService };
export default contactsService;