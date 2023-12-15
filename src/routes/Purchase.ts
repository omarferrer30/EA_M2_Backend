import express from 'express';
import controller from '../controllers/Purchase';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/createpurchase', ValidateSchema(Schemas.purchase.create), controller.createPurchase);
router.get('/readpurchase/:purchaseId', controller.readPurchase);
router.get('/readall', controller.readAll);
router.put('/updatepurchase/:purchaseId', ValidateSchema(Schemas.purchase.update), controller.updatePurchase);
router.delete('/deletepurchase/:purchaseId', controller.deletePurchase);

export = router;