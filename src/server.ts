import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import productRoutes from './routes/Product';
import userRoutes from './routes/User';
import roomRoutes from './routes/Room';
import purchaseRoutes from './routes/Purchase';
import favoriteRoutes from './routes/Favorite';
import ratingRoutes from './routes/Rating';

import cors from 'cors';
import { Server } from 'socket.io';

const router = express();

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority', serverSelectionTimeoutMS:5000 })
    .then(() => {
        //console.log('connected');  // Se puede hacer sin la libreria para el Logging, es solo más estético
        Logging.info('connected to mongoDB');
        StartServer(); // Función para inciar el server solo si se conecta mongoose
    })
    .catch((error) => {
        //console.error(error);
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());
    router.use(cors());

    /** Routes */
    router.use('/users', userRoutes);
    router.use('/products', productRoutes);
    router.use('/purchases', purchaseRoutes);
    router.use('/rooms', roomRoutes);
    router.use('/favorites', favoriteRoutes);
    router.use('/ratings', ratingRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });
    // http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
    const server = http.createServer(router);
    const io = new Server(server);

    interface Message {
        userId: string;
        message: string;
        isReviewLink: boolean;
      }
      
      const messages: Record<string, Message[]> = {};// Almacena los mensajes por sala

    io.on('connection', (socket) => {
        Logging.info('A user connected');
    
        socket.on('join room', (data) => {
            const { userId, roomId } = data;
            socket.join(roomId);
            Logging.info(`User ${userId} joined room ${roomId}`);
    
            // Enviar mensajes existentes de la sala al usuario que acaba de unirse
            if (messages[roomId]) {
                messages[roomId].forEach((message) => {
                    socket.emit('chat message', message);
                });
            }
        });
    
        socket.on('chat message', (data) => {
            const { userId, message, roomId, isReviewLink } = data;
            Logging.info(`Message from ${userId} in room ${roomId}: ${message}`);
        
            // Almacenar el mensaje en la matriz de mensajes
            if (!messages[roomId]) {
                messages[roomId] = [];
            }
            messages[roomId].push({ userId, message, isReviewLink });
        
            // Emitir el mensaje a todos los usuarios en la sala
            io.to(roomId).emit('chat message', { userId, message, isReviewLink });
        });
        
    
        socket.on('leave room', (data) => {
            const { roomId } = data;
            socket.leave(roomId);
            Logging.info(`User ${socket.id} left room ${roomId}`);
        });
    
        socket.on('disconnect', () => {
            Logging.info('User disconnected');
        });
    });
    server.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });

};