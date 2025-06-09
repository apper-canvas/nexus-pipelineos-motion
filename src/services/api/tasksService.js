const tasksService = {
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
          "ModifiedBy", "title", "description", "due_date", "priority", 
          "status", "assigned_to", "related_to_type", "related_to_id"
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch tasks');
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
          "ModifiedBy", "title", "description", "due_date", "priority", 
          "status", "assigned_to", "related_to_type", "related_to_id"
        ]
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to fetch task');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for create operation
      const createData = {
        Name: taskData.title,
        Tags: taskData.tags || "",
        Owner: taskData.owner,
        title: taskData.title,
        description: taskData.description || "",
        due_date: taskData.dueDate,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        assigned_to: taskData.assignedTo || 'John Doe',
        related_to_type: taskData.relatedTo?.type || "",
        related_to_id: taskData.relatedTo?.id || ""
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to create task');
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
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title,
        Tags: taskData.tags || "",
        Owner: taskData.owner,
        title: taskData.title,
        description: taskData.description || "",
        due_date: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        assigned_to: taskData.assignedTo,
        related_to_type: taskData.relatedTo?.type || "",
        related_to_id: taskData.relatedTo?.id || ""
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to update task');
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
      console.error("Error updating task:", error);
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

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response?.success) {
        console.error(response?.message);
        throw new Error(response?.message || 'Failed to delete task');
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
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default tasksService;