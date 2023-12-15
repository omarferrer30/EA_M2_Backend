import mongoose, { Schema, ObjectId, Document } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import User from './User';
import Product from './Product';

export interface IFavorite {
    user: string;
    product: string;  
}

export interface IFavoriteModel extends IFavorite, Document {}

const FavoriteSchema: Schema = new Schema(
    {
        user: { type: String, ref: 'User', required: true },
        product: { type: String, ref: 'Product', required: true },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

FavoriteSchema.plugin(mongoosePagination);
export default mongoose.model<IFavoriteModel, Pagination<IFavoriteModel>>('Favorite', FavoriteSchema);
