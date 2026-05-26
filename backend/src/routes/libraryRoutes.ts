import { Router } from 'express';
import { 
  getSavedQuestions, saveQuestion, deleteSavedQuestion,
  getBlueprints, saveBlueprint, 
  getSourceMaterials, saveSourceMaterial 
} from '../controllers/libraryController';

const router = Router();

router.get('/questions', getSavedQuestions);
router.post('/questions', saveQuestion);
router.delete('/questions/:id', deleteSavedQuestion);

router.get('/blueprints', getBlueprints);
router.post('/blueprints', saveBlueprint);

router.get('/materials', getSourceMaterials);
router.post('/materials', saveSourceMaterial);

export default router;
