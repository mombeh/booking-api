import {
  createTimeSlot,
  isOverlappingTimeSlot,
  findTimeSlotsByProvider,
  findAllTimeSlots,
  updateTimeSlot,
  deleteTimeSlot
} from "../model/timeSlotModel.js";

import { findProviderByUserId } from "../model/providerModel.js";

export const createSlot = async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    // 1️⃣ Get provider record from user id
    const provider = await findProviderByUserId(req.user.id);

    if (!provider) {
      return res.status(403).json({
        message: "Only service providers can create time slots",
      });
    }

    const providerId = provider.id; // ✅ THIS is the real provider ID

    // 2️⃣ Check overlap
    const overlap = await isOverlappingTimeSlot(
      providerId,
      date,
      startTime,
      endTime
    );

    if (overlap) {
      return res
        .status(409)
        .json({ message: "Time slot overlaps with existing one" });
    }

    // 3️⃣ Create slot
    const slot = await createTimeSlot(providerId, date, startTime, endTime);

    res.status(201).json({ message: "Time slot created", slot });
  } catch (err) {
    console.error("Time slot creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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
    console.error("Error fetching time slots:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time } = req.body;

    const provider = await findProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(403).json({ message: "Not a provider" });
    }

    const updatedSlot = await updateTimeSlot({
      id,
      providerId: provider.id,
      date,
      start_time,
      end_time,
    });

    if (!updatedSlot) {
      return res.status(404).json({
        message: "Time slot not found or not authorized",
      });
    }

    res.status(200).json({
      message: "Time slot updated successfully",
      updatedSlot,
    });
  } catch (err) {
    console.error("Error updating time slot:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Verify provider
    const provider = await findProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(403).json({ message: "Not a provider" });
    }

    // 2️⃣ Delete slot
    const deleted = await deleteTimeSlot(id, provider.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Time slot not found or not authorized",
      });
    }

    // 3️⃣ Success response
    res.status(200).json({
      message: "Time slot deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

