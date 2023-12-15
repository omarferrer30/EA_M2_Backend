import mongoose, { Schema, ObjectId, Document } from 'mongoose';
import {mongoosePagination, Pagination} from 'mongoose-paginate-ts';
import User from './User';
import Product from './Product';

export interface IPurchase {
    username: string;
    name: string; 
    quantity: number; 
}

export interface IPurchaseModel extends IPurchase, Document {}

const PurchaseSchema: Schema = new Schema(
    {
        username: { type: String, ref: 'User', required: true },
        name: { type: String, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

PurchaseSchema.plugin(mongoosePagination);
export default mongoose.model<IPurchaseModel, Pagination<IPurchaseModel>>('Purchase', PurchaseSchema);
