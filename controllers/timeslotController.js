import { createTimeSlot, isOverlappingTimeSlot } from '../model/timeSlotModel.js';
import { findProviderByUserId } from '../model/providerModel.js';


export const createSlot = async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const userId = req.user?.id;

  try {
    const provider = await findProviderByUserId(userId);

    if (!provider) {
      return res.status(403).json({ message: 'Only service providers can create time slots' });
    }

    const overlap = await isOverlappingTimeSlot(provider.id, date, startTime, endTime);
    if (overlap) {
      return res.status(409).json({ message: 'Time slot overlaps with existing one' });
    }

    const slot = await createTimeSlot(provider.id, date, startTime, endTime);
    res.status(201).json({ message: 'Time slot created', slot });
  } catch (err) {
    console.error('Time slot creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

import TimeSlot from '../models/timeSlotModel.js';

export const viewTimeSlots = async (req, res) => {
  try {
    const filter = {};

    // Optional filter: providerId (for viewing provider's slots)
    if (req.query.providerId) {
      filter.provider = req.query.providerId;
    }

    const timeSlots = await TimeSlot.find(filter);

    res.status(200).json({
      success: true,
      data: timeSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

