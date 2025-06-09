import emailTemplatesData from '@/services/mockData/emailTemplates.json';

let templates = [...emailTemplatesData];

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const emailTemplatesService = {
  async getAll() {
    await delay(300);
    return [...templates];
  },

  async getById(id) {
    await delay(200);
    const template = templates.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  },

  async create(templateData) {
    await delay(400);
    
    const newTemplate = {
      id: Date.now(),
      ...templateData,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        openRate: 0,
        clickRate: 0
      }
    };
    
    templates.push(newTemplate);
    return { ...newTemplate };
  },

  async update(id, updates) {
    await delay(400);
    
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    // Create new version if content changed
    const currentTemplate = templates[index];
    const isContentChange = updates.content !== currentTemplate.content || 
                           updates.subject !== currentTemplate.subject;
    
    const updatedTemplate = {
      ...currentTemplate,
      ...updates,
      version: isContentChange ? currentTemplate.version + 1 : currentTemplate.version,
      updatedAt: new Date().toISOString()
    };
    
    templates[index] = updatedTemplate;
    return { ...updatedTemplate };
  },

  async delete(id) {
    await delay(300);
    
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates.splice(index, 1);
    return { success: true };
  },

  async sendTestEmail(templateId, testEmail) {
    await delay(500);
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Simulate sending test email
    console.log(`Sending test email to ${testEmail} with template: ${template.name}`);
    
    return {
      success: true,
      message: `Test email sent to ${testEmail}`,
      templateId,
      sentAt: new Date().toISOString()
    };
  },

  async getTemplateStats(templateId) {
    await delay(200);
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    return { ...template.stats };
  },

  async updateTemplateStats(templateId, action) {
    await delay(200);
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    switch (action) {
      case 'sent':
        template.stats.sent += 1;
        break;
      case 'opened':
        template.stats.opened += 1;
        template.stats.openRate = (template.stats.opened / template.stats.sent) * 100;
        break;
      case 'clicked':
        template.stats.clicked += 1;
        template.stats.clickRate = (template.stats.clicked / template.stats.sent) * 100;
        break;
    }
    
    return { ...template.stats };
  },

  async renderTemplate(templateId, data = {}) {
    await delay(200);
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
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
      templateId: template.id,
      templateName: template.name
    };
  }
};

export default emailTemplatesService;