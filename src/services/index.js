import contactsService from './api/contactsService';
import companiesService from './api/companiesService';
import dealsService from './api/dealsService';
import tasksService from './api/tasksService';
import emailTemplatesService from './api/emailTemplatesService';

export { contactsService };
export { companiesService };
export { dealsService };
export { tasksService };
export { emailTemplatesService };

// Default export for convenience
export default {
  contactsService,
  companiesService,
  dealsService,
  tasksService,
  emailTemplatesService
};