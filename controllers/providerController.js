import { query } from '../config/db.js';

export const getProvidersWithTimeSlots = async (req, res) => {
  try {
    const providersRes = await query(`
      SELECT id, email, service_name FROM providers
    `);

    const timeSlotsRes = await query(`
      SELECT * FROM time_slots WHERE is_booked = false
    `);

    const providers = providersRes.rows;
    const timeSlots = timeSlotsRes.rows;

    const result = providers.map((provider) => {
      const providerSlots = timeSlots.filter((slot) => slot.provider_id === provider.id);
      return {
        ...provider,
        timeSlots: providerSlots,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Failed to fetch providers with slots:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

