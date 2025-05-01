//model/usermodel
import { query } from '../config/db.js';

export const createUser = async (firstName, lastName, email, hashedPassword) => {
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email, created_at;
    `;
    const values = [firstName, lastName, email, hashedPassword];
    const result = await query(insertQuery, values);
    return result.rows[0];
  };

export const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
