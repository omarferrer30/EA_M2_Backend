import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Favorite from '../models/Favorite';
import { mongoosePagination, PaginationOptions } from 'mongoose-paginate-ts';
import Product from '../models/Product';
import User from '../models/User';

const createFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const { user, product } = req.body;

    try {
        // Verificar si el usuario y el producto existen en la base de datos por nombre
        const userExists = await User.findById(user);
        const productExists = await Product.findById(product);

        console.log('userExists:', userExists);
        console.log('productExists:', productExists);

        if (!userExists || !productExists) {
            return res.status(404).json({
                message: 'User or product not found in the database',
                userExists,
                productExists,
            });
        }
    console.log('userExists.username:', userExists.username);
    console.log('productExists.name:', productExists.name);

    const favorite = new Favorite({
        _id: new mongoose.Types.ObjectId(),
        user: userExists._id,
        product: productExists._id
    });

    const savedFavorite = await favorite.save();

    return res.status(201).json(savedFavorite);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readFavorite = (req: Request, res: Response, next: NextFunction) => {
    const favoriteId = req.params.favoriteId;

    return Favorite.findById(favoriteId)
        .then((favorite) => (favorite ? res.status(200).json(favorite) : res.status(404).json({ message: 'Favorite not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const options: PaginationOptions = {
        page,
        limit: 3,
    };
    return Favorite.paginate(options)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json({ error }));
};

const updateFavorite = (req: Request, res: Response, next: NextFunction) => {
    const favoriteId = req.params.favoriteId;

    return Favorite.findById(favoriteId)
        .then((favorite) => {
            if (favorite) {
                favorite.set(req.body);

                return favorite
                    .save()
                    .then((updatedFavorite) => res.status(200).json(updatedFavorite))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'Favorite not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteFavorite = (req: Request, res: Response, next: NextFunction) => {
    const favoriteId = req.params.favoriteId;

    return Favorite.findByIdAndDelete(favoriteId)
        .then((favorite) =>
            favorite ? res.status(204).json({ message: 'Favorite deleted' }) : res.status(404).json({ message: 'Favorite not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const readUserFavorites = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId; 

    try {
        const userFavorites = await Favorite.find({ user: userId })
            .select('-user -_id -username -createdAt -updatedAt') // Excluye campos innecesarios de "Favorite"
            .populate('product') // Incluye información del "Product"
            .exec();

        if (!userFavorites || userFavorites.length === 0) {
            return res.status(404).json({ message: 'No favorites found for the user' });
        }

        // Mapea los resultados para obtener una lista de productos
        const productList = userFavorites.map(favorite => favorite.product);

        return res.status(200).json({docs: productList});
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const checkIfUserHasFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.params;

    try {
        // Verificar si existe un favorito con el usuario y el producto dados
        const favorito = await Favorite.findOne({ user: userId, product: productId });

        if (favorito) {
            return res.status(200).json({ exists: true, favoriteId: favorito._id });
        } else {
            return res.status(200).json({ exists: false, favoriteId: null });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createFavorite, readFavorite, readAll, updateFavorite, deleteFavorite, readUserFavorites, checkIfUserHasFavorite};
