import { Router } from 'express';
import { createTrip, joinTrip, getUserTrips } from '../controllers/trip.js';
import { VerifyJWT } from '../middlewares/auth.js';

const tripRouter = Router();

tripRouter.post('/create', VerifyJWT, createTrip);
tripRouter.post('/join', VerifyJWT, joinTrip);
tripRouter.get('/my-trips', VerifyJWT, getUserTrips);

export { tripRouter };
