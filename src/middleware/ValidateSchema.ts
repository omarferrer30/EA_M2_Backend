import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { IProduct } from '../models/Product';
import { IPurchase } from '../models/Purchase';
import { IRoom } from '../models/Room';
import mongoose from 'mongoose';
import { IFavorite } from '../models/Favorite';
import { IRating } from '../models/Rating';

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required(),
            fullname: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            rol: Joi.string().required(),
            rating: Joi.number().required(),
            profileImage: Joi.string().allow('').required(),
        }),
        update: Joi.object<IUser>({
            username: Joi.string().required(),
            fullname: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
        })
    },
    product: {
        create: Joi.object<IProduct>({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            units: Joi.number().integer().min(1).required(),
            user: Joi.string().required(),
            productImage: Joi.array().items(Joi.string()).required(),
            location: Joi.object({
                latitude: Joi.number(),
                longitude: Joi.number(),
            }).optional(),
        }),
        update: Joi.object<IProduct>({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            units: Joi.number().integer().min(1).required(),
            user: Joi.string().required(),
            productImage: Joi.array().items(Joi.string()).required(),
            location: Joi.object({
                latitude: Joi.number(),
                longitude: Joi.number(),
            }).optional(),
        })
    },
    purchase: {
        create: Joi.object<IPurchase>({
            username: Joi.string().required(),
            name: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        }),
        update: Joi.object<IPurchase>({
            username: Joi.string().required(),
            name: Joi.string().required(),
            quantity: Joi.number().integer().min(1)
        }),

    },
    room: {
        create: Joi.object<IRoom>({
            userId1: Joi.string().required(),
            userId2: Joi.string().required(),
        }),
    },
  
    favorite: {
        create: Joi.object<IFavorite>({
            user: Joi.string().required(),
            product: Joi.string().required()
        }),
        update: Joi.object<IFavorite>({
            user: Joi.string().required(),
            product: Joi.string().required()
            }),
        },
        rating: {
            create: Joi.object<IRating>({
                userId1: Joi.string().required(),
                userId2: Joi.string().required(),
                rating: Joi.number().required(),
                comment: Joi.string().required(),
            }),
            update: Joi.object<IRating>({
                userId1: Joi.string().required(),
                userId2: Joi.string().required(),
                rating: Joi.number().required(),
                comment: Joi.string().required(),
            }),
        },
    
};
