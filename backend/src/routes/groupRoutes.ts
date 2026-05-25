import { Router } from 'express';
import { 
  getGroups, createGroup, getGroupById, 
  addStudent, addGrade, addSubGroup, generateReport 
} from '../controllers/groupController';

const router = Router();

router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroupById);
router.post('/:id/students', addStudent);
router.post('/:id/grades', addGrade);
router.post('/:id/subgroups', addSubGroup);
router.post('/report', generateReport);

export default router;
