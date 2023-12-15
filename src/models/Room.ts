import mongoose, { Document, Schema } from 'mongoose';
import {mongoosePagination, Pagination} from 'mongoose-paginate-ts';

export interface IRoom {
    userId1: string;
    userId2: string;
}

export interface IRoomModel extends IRoom, Document {}

const RoomSchema: Schema = new Schema(
    {
        userId1: { type: String, ref: 'User', required: true },
        userId2: { type: String, ref: 'User', required: true },
    },
    {
        versionKey: false
    }
);

RoomSchema.plugin(mongoosePagination);
export default mongoose.model<IRoomModel, Pagination<IRoomModel>>('Room', RoomSchema);
