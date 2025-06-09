import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskForm = ({ formData, setFormData, handleSubmit, handleCloseModal, editingTask, priorities, statuses }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Title"
        type="text"
        required
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />

      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={3}
      />

      <FormField
        label="Due Date & Time"
        type="datetime-local"
        required
        value={formData.dueDate}
        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Priority"
          type="select"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          options={priorities.map(p => ({ value: p.value, label: p.label }))}
        />

        <FormField
          label="Status"
          type="select"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          options={statuses.map(s => ({ value: s.value, label: s.label }))}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={handleCloseModal}
          className="text-gray-700 border border-gray-300 hover:bg-gray-50 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-primary/90"
        >
          {editingTask ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;