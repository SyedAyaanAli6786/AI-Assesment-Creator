import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  deleteAssignment,
  regenerateAssignment,
  getJobStatus,
  renameAssignment,
} from '../controllers/assignmentController';

const router = Router();

// Assignment CRUD
router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.delete('/:id', deleteAssignment);

// Regeneration & Updates
router.post('/:id/regenerate', regenerateAssignment);
router.patch('/:id/rename', renameAssignment);

// Job status
router.get('/job/:jobId', getJobStatus);

export default router;
