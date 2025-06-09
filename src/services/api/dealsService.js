const dealsService = {
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
          "ModifiedBy", "title", "value", "stage", "probability", "close_date", 
          "owner", "description", "contact_id", "company_id"
        ]
      };

      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch deals');
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
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
          "ModifiedBy", "title", "value", "stage", "probability", "close_date", 
          "owner", "description", "contact_id", "company_id"
        ]
      };

      const response = await apperClient.getRecordById('deal', id, params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch deal');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const createData = {
        Name: dealData.title || dealData.name,
        Tags: dealData.tags || "",
        Owner: dealData.owner,
        title: dealData.title,
        value: dealData.value || 0,
        stage: dealData.stage || 'lead',
        probability: dealData.probability || 10,
        close_date: dealData.closeDate || dealData.close_date,
        owner: dealData.owner,
        description: dealData.description || "",
        contact_id: dealData.contactId ? parseInt(dealData.contactId) : null,
        company_id: dealData.companyId ? parseInt(dealData.companyId) : null
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('deal', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to create deal');
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
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        Name: dealData.title || dealData.name,
        Tags: dealData.tags || "",
        Owner: dealData.owner,
        title: dealData.title,
        value: dealData.value || 0,
        stage: dealData.stage,
        probability: dealData.probability,
        close_date: dealData.closeDate || dealData.close_date,
        owner: dealData.owner,
        description: dealData.description || "",
        contact_id: dealData.contactId ? parseInt(dealData.contactId) : null,
        company_id: dealData.companyId ? parseInt(dealData.companyId) : null
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('deal', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to update deal');
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
      console.error("Error updating deal:", error);
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

      const response = await apperClient.deleteRecord('deal', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to delete deal');
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
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};

export default dealsService;