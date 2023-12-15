import mongoose, { Document, Schema } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

export interface ILocation {
    type: string;
    coordinates: [number, number]; 
}

export interface IProduct {
    name: string;
    description: string;
    price: number;
    units: number;
    user: string;
    productImage: string[];
    location?: ILocation;
}

export interface IProductModel extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        units: { type: Number, required: true },
        user: { type: String, ref: 'User', required: true },
        productImage: { type: [String], required: true },
        location: {
            latitude: { type: Number, default: 0 },
            longitude: { type: Number, default: 0 },
        },
    },
    {
        versionKey: false
    }
);

ProductSchema.plugin(mongoosePagination);
export default mongoose.model<IProductModel, Pagination<IProductModel>>('Product', ProductSchema);
