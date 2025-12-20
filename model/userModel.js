//model/usermodel
import { query } from '../config/db.js';

export const createUser = async (
  firstName,
  lastName,
  email,
  hashedPassword,
  role
) => {
  const result = await query(
    `
    INSERT INTO users (first_name, last_name, email, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name, email, role;
    `,
    [firstName, lastName, email, hashedPassword, role]
  );

  return result.rows[0];
};


export const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
