import { query } from '../config/db.js';

export const createTimeSlot = async (providerId, date, startTime, endTime) => {
  const result = await query(
    `
    INSERT INTO time_slots (provider_id, date, start_time, end_time)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [providerId, date, startTime, endTime]
  );
  return result.rows[0];
};

export const isOverlappingTimeSlot = async (providerId, date, startTime, endTime, excludeId = null) => {
  let queryText = `
    SELECT * FROM time_slots
    WHERE provider_id = $1 AND date = $2
    AND (
      (start_time < $4 AND end_time > $3)
    )
  `;
  const params = [providerId, date, startTime, endTime];

  if (excludeId) {
    queryText += ' AND id != $5';
    params.push(excludeId);
  }

  const result = await query(queryText, params);
  return result.rows.length > 0;
};

export const findTimeSlotsByProvider = async (providerId) => {
  const result = await query(
    `SELECT * FROM time_slots WHERE provider_id = $1 AND is_booked = false`,
    [providerId]
  );
  return result.rows;
};

export const findAllTimeSlots = async () => {
  const result = await query(`SELECT * FROM time_slots`);
  return result.rows;
};

// model/timeSlotModel.js
export const updateTimeSlot = async ({ id, providerId, date, start_time, end_time }) => {
    const updateQuery = `
      UPDATE time_slots
      SET date = $1, start_time = $2, end_time = $3
      WHERE id = $4 AND provider_id = $5
      RETURNING *;
    `;
    const values = [date, start_time, end_time, id, providerId];
    const result = await query(updateQuery, values);
    return result.rows[0]; // null if nothing was updated
  };
  
  export const deleteTimeSlot = async (slotId, providerId) => {
    const result = await query(
      `DELETE FROM time_slots
       WHERE id = $1 AND provider_id = $2
       RETURNING *`,
      [slotId, providerId]
    );
    return result.rows[0];
  };
  
export const unbookTimeSlot = async (timeSlotId) => {
  const result = await query(
    `UPDATE time_slots SET is_booked = false WHERE id = $1 RETURNING *`,
    [timeSlotId]
  );
  return result.rows[0];
};

