// lib/db.ts
import { Pool } from 'pg'; // This is the PostgreSQL client library we installed

// Load DATABASE_URL from your .env file
const connectionString = process.env.DATABASE_URL;

// Ensure the environment variable is set
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

// Create a connection pool. This efficiently manages database connections.
// It keeps connections open and reuses them, which is much faster than opening a new one for each query.
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // This is often needed for local development against cloud databases.
        // In production, consider stricter SSL verification if you have CA certs.
    }
});

// Optional: Log when connections are made or errors occur (helpful for debugging)
pool.on('connect', () => {
    console.log('PostgreSQL Pool: Connected to database!');
});

pool.on('error', (err) => {
    console.error('PostgreSQL Pool Error:', err.message, err.stack);
});

// --- Our Core SQL Execution Function ---
// This is the function you'll use to run all your SQL queries.
export async function sql(
    query: string, // The SQL query string (e.g., "SELECT * FROM users")
    params: any[] = [] // Optional: An array of values to safely insert into the query (prevents SQL injection)
): Promise<any[]> {
    const client = await pool.connect(); // Get a client from the connection pool
    try {
        const result = await client.query(query, params); // Execute the query with optional parameters
        return result.rows; // Return the fetched rows (data)
    } finally {
        client.release(); // Release the client back to the pool, making it available for others.
    }
}