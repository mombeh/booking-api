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

export const isOverlappingTimeSlot = async (providerId, date, startTime, endTime) => {
  const result = await query(
    `
    SELECT * FROM time_slots
    WHERE provider_id = $1 AND date = $2
    AND (
      (start_time < $4 AND end_time > $3)
    );
    `,
    [providerId, date, startTime, endTime]
  );
  return result.rows.length > 0;
};
