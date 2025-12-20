//model/providermodel
import { query } from '../config/db.js';

export const findProviderById = async (providerId) => {
    const result = await query('SELECT * FROM service_providers WHERE id = $1', [providerId]);
    return result.rows[0];
  };
  
  export const findProviderByUserId = async (userId) => {
    const result = await query('SELECT * FROM service_providers WHERE user_id = $1', [userId]);
    return result.rows[0];
  };

  export const createProvider = async (userId, name) => {
    const queryText = `
      INSERT INTO service_providers (user_id, name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await query(queryText, [userId, name]);
    return result.rows[0];
  };
  