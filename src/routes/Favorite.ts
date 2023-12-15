import express from 'express';
import controller from '../controllers/Favorite';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/createfavorite', ValidateSchema(Schemas.favorite.create), controller.createFavorite);
router.get('/readfavorite/:favoriteId', controller.readFavorite);
router.get('/readall', controller.readAll);
router.put('/updatefavorite/:favoriteId', ValidateSchema(Schemas.favorite.update), controller.updateFavorite);
router.delete('/deletefavorite/:favoriteId', controller.deleteFavorite);
router.get('/readuserfavorites/:userId', controller.readUserFavorites);
router.get('/favoriteexist/:userId/:productId', controller.checkIfUserHasFavorite);

export = router;
