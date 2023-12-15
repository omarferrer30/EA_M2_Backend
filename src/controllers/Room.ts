import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import {mongoosePagination, PaginationOptions } from 'mongoose-paginate-ts';
import Room from '../models/Room';
import User from '../models/User';

const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { userId1, userId2 } = req.body;

    try {
        const userExists1 = await User.findById(userId1);
        const userExists2 = await User.findById(userId2);

        if (!userExists1 || !userExists2) {
            return res.status(404).json({ message: 'User not found in the database', userExists1, userExists2 });
        }

        const room = new Room({
            _id: new mongoose.Types.ObjectId(),
            userId1: userExists1._id,
            userId2: userExists2._id,
        });

        const newRoom = await room.save();
        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readRoom = (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;

    return Room.findById(roomId)
        .then((room) => (room ? res.status(200).json( room ) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readRoomsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const rooms = await Room.find({ $or: [{ userId1: userId }, { userId2: userId }] });

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found for the user' });
        }
        return res.status(200).json({rooms});
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const findExistRoom = async (req: Request, res: Response, next: NextFunction) => {
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;

    try {
        const rooms = await Room.find({
            $or: [
                { userId1, userId2 },
                { userId1: userId2, userId2: userId1 }, 
            ],
        });

        if (rooms.length === 0) {
            return res.status(200).json({ exist: false, message: 'No rooms found for the users' });
        }

        return res.status(200).json({ exist: true });
    } catch (error) {
        return res.status(500).json({ error });
    }
};


const readAll = (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1; 
    const options: PaginationOptions = {
        page,
        limit: 3
    };
    return Room.paginate(options)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json({ error }));
};

const deleteRoom = (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;

    return Room.findByIdAndDelete(roomId)
        .then((room) => (room ? res.status(201).json({ room, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createRoom, readRoom, readAll, deleteRoom, readRoomsByUserId, findExistRoom };
