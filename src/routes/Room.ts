import express from 'express';
import controller from '../controllers/Room';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.post('/createroom', ValidateSchema(Schemas.room.create), controller.createRoom);
router.get('/readroom/:roomId', controller.readRoom);
router.get('/readall'/*, [verifyToken]*/, controller.readAll);
router.get('/readrooms/:userId', controller.readRoomsByUserId); 
router.get('/roomexist/:userId1/:userId2', controller.findExistRoom);
router.delete('/deleteroom/:roomId', controller.deleteRoom);

export = router;
