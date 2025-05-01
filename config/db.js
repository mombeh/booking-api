//config/db
import pg from "pg"
import logger from "../utils/logger.js"
import "dotenv/config"

const { Pool } = pg

const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_NAME_TEST,
    NODE_ENV
} = process.env

if (!DB_HOST || !DB_PASSWORD || !DB_NAME || !DB_USER || !DB_PORT || !DB_NAME_TEST) {
    logger.error("Database environment variable are missing! Check your .env file.")
    process.exit(1)
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.NODE_ENV === "test" ? DB_NAME_TEST : DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
    connectionTimeoutMillis: 2000
})
logger.info(`Database is configured for: ${DB_NAME}`)

pool.on("connect", (client) => {
    logger.info(`Client connected from Pool (Total count: ${pool.totalCount})`)
})

pool.on("error", (err, client) => {
    logger.error('Unexpected error on idle client in pool', err)
    process.exit(-1)
})

const initializeDbSchema = async () => {
    const client = await pool.connect();
    try {
        logger.info("Initializing database schema...");

        // pgcrypto for UUIDs
        await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
        logger.info('pgcrypto extension ensured');

        await client.query(`
      DROP TABLE IF EXISTS appointments, time_slots, service_providers, users CASCADE;
    `);
        logger.info('Dropped all existing tables');


        // Users Table (Clients)
        await client.query(`
        CREATE TABLE IF NOT EXISTS users (
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           first_name VARCHAR(100) NOT NULL,
           last_name VARCHAR(100) NOT NULL,
           email VARCHAR(255) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL,
           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
       `);
        logger.info('Users table has been created')

        // // Service Providers Table (Simplified)
        await client.query(`
        CREATE TABLE IF NOT EXISTS service_providers (
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Link to users table
           service_name VARCHAR(100) NOT NULL,
           email VARCHAR(255) UNIQUE,
           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
       `);
        logger.info('service_provider table has been created')

        // // Time Slots Table
         await client.query(`
        CREATE TABLE IF NOT EXISTS time_slots (
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE, -- Link to service provider
           date DATE NOT NULL,
           start_time TIME NOT NULL,
           end_time TIME NOT NULL,
           is_booked BOOLEAN DEFAULT FALSE,  -- Tracks if the slot is booked or not
           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        `);
         logger.info('time_slots table has been created')

        // Appointments Table
         await client.query(`
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Link to client/user
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE, -- Link to service provider
  appointment_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- Pending, Confirmed, Canceled
  notes TEXT,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE, -- Link to time slot
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
         `);
        logger.info('appointments table has been created');

        // Create indexes after both tables are ready
        await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`)
        await client.query(`CREATE INDEX IF NOT EXISTS idx_service_providers_email ON service_providers(email);`)
        await client.query(`CREATE INDEX IF NOT EXISTS idx_time_slots_provider_id ON time_slots(provider_id);`)
        await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);`)
        await client.query(`CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);`)   
        logger.info('Indexes created');

        // Triggers and other functions
         await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
           RETURNS TRIGGER AS $$
           BEGIN
             NEW.updated_at = NOW();
             RETURN NEW;
           END;
           $$ LANGUAGE plpgsql;
        `);
         logger.debug('update_updated_at_column function ensured.');

        await client.query(`
        DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
          CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
       END $$;
    `);
        logger.debug("Users update_at Trigger is checked and created");

        await client.query(`
       DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_appointments_updated_at') THEN
           CREATE TRIGGER update_appointments_updated_at
           BEFORE UPDATE ON appointments
           FOR EACH ROW
           EXECUTE FUNCTION update_updated_at_column();
        END IF;
       END $$;
         `);
         logger.debug("Appointments update_at Trigger is checked and created");

    } catch (error) {
        logger.error(`Error while initializing the schema`, error);
        process.exit(1);
    } finally {
        client.release();
    }
}

const connectToDb = async () => {
    try {
        const client = await pool.connect()
        logger.info(`Database connection pool established successfully`)
        client.release()
    } catch (error) {
        logger.error('Unable to establish database connection pool', error)
        process.exit(1)
    }
}

const query = async (text, params) => {
    const start = Date.now()
    try {
        const response = await pool.query(text, params)
        const duration = Date.now() - start;
        logger.info(`Executed query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, duration: ${duration}ms, rows: ${response.rowCount}}`);
        return response
    } catch (error) {
        logger.error(`Error executing query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, error: ${error.message}}`);
        throw error
    }
}

export { pool, connectToDb, query, initializeDbSchema }
