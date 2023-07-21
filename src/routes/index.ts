import {Router} from 'express';
import {Users} from './users';

const router: Router = Router();

router.use('/', Users);
export const MainRouter: Router = router;