import { Trip } from '../models/trip.js';

// Create a new trip
export const createTrip = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      // ✅ Pull user ID from the token
      const userId = req.userId;
  

      const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase();
  
      const newTrip = await Trip.create({
        name,
        description,
        inviteCode,
        createdBy: userId,
        members: [userId],
      });
  
      res.status(201).json(newTrip);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Join an existing trip via inviteCode
export const joinTrip = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const trip = await Trip.findOne({ inviteCode });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Add user to members if not already in
    if (!trip.members.includes(req.userId)) {
      trip.members.push(req.userId);
      await trip.save();
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trips for logged-in user
export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ members: req.userId });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};