import { contactsService } from './api/contactsService';
import { companiesService } from './api/companiesService';
import { dealsService } from './api/dealsService';
import { tasksService } from './api/tasksService';
import { emailTemplatesService } from './api/emailTemplatesService';

export { contactsService } from './api/contactsService';
export { companiesService } from './api/companiesService';
export { dealsService } from './api/dealsService';
export { tasksService } from './api/tasksService';
export { emailTemplatesService } from './api/emailTemplatesService';

// Default export for convenience
export default {
  contactsService,
  companiesService,
  dealsService,
  tasksService,
  emailTemplatesService
};