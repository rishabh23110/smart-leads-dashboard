import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/lead.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
} from '../validators/lead.validator.js';

const router = Router();

router.use(authenticate);

router.get('/export', exportLeadsCSV);
router.get('/stats', getLeadStats);
router.get('/', validate(leadQuerySchema, 'query'), getLeads);
router.post('/', validate(createLeadSchema), createLead);
router.get('/:id', getLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
