//model/providermodel
import { query } from '../config/db.js';

export const findProviderByUserId = async (userId) => {
    const queryText = 'SELECT * FROM service_providers WHERE user_id = $1';
    const result = await query(queryText, [userId]);
    return result.rows[0];
  };
  
  export const createProvider = async (userId, serviceName) => {
    const queryText = `
      INSERT INTO service_providers (user_id, service_name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await query(queryText, [userId, serviceName]);
    return result.rows[0];
  };
  