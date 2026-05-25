import { Router } from 'express';
import { 
  getSavedQuestions, saveQuestion, 
  getBlueprints, saveBlueprint, 
  getSourceMaterials, saveSourceMaterial 
} from '../controllers/libraryController';

const router = Router();

router.get('/questions', getSavedQuestions);
router.post('/questions', saveQuestion);

router.get('/blueprints', getBlueprints);
router.post('/blueprints', saveBlueprint);

router.get('/materials', getSourceMaterials);
router.post('/materials', saveSourceMaterial);

export default router;
