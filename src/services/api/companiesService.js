const companiesService = {
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
          "ModifiedBy", "industry", "size", "website", "annual_revenue"
        ]
      };

      const response = await apperClient.fetchRecords('company', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch companies');
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error);
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
          "ModifiedBy", "industry", "size", "website", "annual_revenue"
        ]
      };

      const response = await apperClient.getRecordById('company', id, params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch company');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const createData = {
        Name: companyData.name || companyData.Name,
        Tags: companyData.tags || companyData.Tags || "",
        Owner: companyData.owner || companyData.Owner,
        industry: companyData.industry,
        size: companyData.size,
        website: companyData.website,
        annual_revenue: companyData.annualRevenue || companyData.annual_revenue || 0
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('company', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to create company');
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
      console.error("Error creating company:", error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        Name: companyData.name || companyData.Name,
        Tags: companyData.tags || companyData.Tags || "",
        Owner: companyData.owner || companyData.Owner,
        industry: companyData.industry,
        size: companyData.size,
        website: companyData.website,
        annual_revenue: companyData.annualRevenue || companyData.annual_revenue || 0
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('company', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to update company');
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
      console.error("Error updating company:", error);
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

      const response = await apperClient.deleteRecord('company', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to delete company');
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
      console.error("Error deleting company:", error);
      throw error;
    }
  }
};

export default companiesService;