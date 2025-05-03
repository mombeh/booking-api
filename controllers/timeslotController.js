//controller/timeslotController.js
import { createTimeSlot } from '../model/timeSlotModel.js';
import { findProviderById } from '../model/providerModel.js';
import { findProviderByUserId } from '../model/providerModel.js';


export const createSlot = async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const userId = req.user?.id;

  try {
    const provider = await findProviderById(req.user.id);

    if (!provider) {
      return res.status(403).json({ message: 'Only service providers can create time slots' });
    }

    // const overlap = await isOverlappingTimeSlot(provider.id, date, startTime, endTime);
    // if (overlap) {
    //   return res.status(409).json({ message: 'Time slot overlaps with existing one' });
    // }

    const slot = await createTimeSlot(provider.id, date, startTime, endTime);
    res.status(201).json({ message: 'Time slot created', slot });
  } catch (err) {
    console.error('Time slot creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/timeSlotController.js
import { findTimeSlotsByProvider, findAllTimeSlots } from '../model/timeSlotModel.js';

export const viewTimeSlots = async (req, res) => {
  try {
    const { provider_id } = req.query;

    let slots;
    if (provider_id) {
      slots = await findTimeSlotsByProvider(provider_id);
    } else {
      slots = await findAllTimeSlots();
    }

    res.status(200).json(slots);
  } catch (err) {
    console.error('Error fetching time slots:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// controllers/timeSlotController.js
import { updateTimeSlot, deleteTimeSlot } from '../model/timeSlotModel.js';

export const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { date, start_time, end_time } = req.body;
  const providerId = req.user.id;

  try {
    const updatedSlot = await updateTimeSlot({ id, providerId, date, start_time, end_time });

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Time slot not found or not authorized' });
    }

    res.status(200).json({ message: 'Time slot updated successfully', updatedSlot });
  } catch (err) {
    console.error('Error updating time slot:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteSlot = async (req, res) => {
  const slotId = req.params.id;
  const providerId = req.user.id;

  try {
    const deleted = await deleteTimeSlot(slotId, providerId);
    if (!deleted) {
      return res.status(404).json({ message: 'Time slot not found or unauthorized' });
    }
    res.status(200).json({ message: 'Time slot deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  



