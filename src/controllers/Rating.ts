import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Rating from '../models/Rating';
import { mongoosePagination, PaginationOptions } from 'mongoose-paginate-ts';
import User from '../models/User';

const createRating = async (req: Request, res: Response, next: NextFunction) => {
    const { userId1, userId2, rating, comment } = req.body;

    try {
        const user1Exists = await User.findById(userId1);
        const user2Exists = await User.findById(userId2);

        if (!user1Exists || !user2Exists) {
            return res.status(404).json({ message: 'One or more users not found in the database' });
        }

        const newRating = new Rating({
            userId1: user1Exists._id,
            userId2: user2Exists._id,
            rating,
            comment,
        });

        const savedRating = await newRating.save();
        return res.status(201).json(savedRating);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};

const readRating = (req: Request, res: Response, next: NextFunction) => {
    const ratingId = req.params.ratingId;

    return Rating.findById(ratingId)
        .then((rating) => (rating ? res.status(200).json(rating) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllRatings = (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const options: PaginationOptions = {
        page,
        limit: 8,
    };

    return Rating.paginate(options)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json({ error }));
};

const updateRating = (req: Request, res: Response, next: NextFunction) => {
    const ratingId = req.params.ratingId;

    return Rating.findById(ratingId)
        .then((rating) => {
            if (rating) {
                rating.set(req.body);

                return rating
                    .save()
                    .then((rating) => res.status(201).json({ rating }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteRating = (req: Request, res: Response, next: NextFunction) => {
    const ratingId = req.params.ratingId;

    return Rating.findByIdAndDelete(ratingId)
        .then((rating) => (rating ? res.status(201).json({ rating, message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const updateAverageRating = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const userRatings = await Rating.find({ userId2: userId }, 'rating');

        if (userRatings.length > 0) {
            const totalRatings = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRatings / userRatings.length;

            // Actualiza la variable rating del usuario
            await User.findByIdAndUpdate(userId, { rating: averageRating });
        } else {
            // Si no hay ratings, actualiza la variable rating a 0
            await User.findByIdAndUpdate(userId, { rating: 0 });
        }

        return res.status(200).json({ message: 'Average rating updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};

export default { createRating, readRating, readAllRatings, updateRating, deleteRating, updateAverageRating};
