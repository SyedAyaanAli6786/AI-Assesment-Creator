import { Router } from 'express';
import { handleGenerateToolkit } from '../controllers/toolkitController';

const router = Router();

router.post('/generate', handleGenerateToolkit);

export default router;
