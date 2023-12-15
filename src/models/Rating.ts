import mongoose, { Document, Schema } from 'mongoose';
import {mongoosePagination, Pagination} from 'mongoose-paginate-ts';

export interface IRating {
    userId1: string;
    userId2: string;
    rating: number;
    comment: string;
}

export interface IRatingModel extends IRating, Document {}

const RatingSchema: Schema = new Schema(
    {
        userId1: { type: String, ref: 'User', required: true },
        userId2: { type: String, ref: 'User', required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    {
        versionKey: false
    }
);

RatingSchema.plugin(mongoosePagination);
export default mongoose.model<IRatingModel, Pagination<IRatingModel>>('Rating', RatingSchema);
