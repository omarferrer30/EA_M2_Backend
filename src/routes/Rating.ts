import express from 'express';
import controller from '../controllers/Rating';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.post('/createrating', ValidateSchema(Schemas.rating.create), controller.createRating);
router.get('/readrating/:ratingId', controller.readRating);
router.get('/readallratings', [verifyToken], controller.readAllRatings);
router.put('/updaterating/:ratingId', ValidateSchema(Schemas.rating.update), controller.updateRating);
router.delete('/deleterating/:ratingId', controller.deleteRating);
router.put('/updateaveragerating/:userId', controller.updateAverageRating);

export = router;
