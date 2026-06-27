import mysql from 'mysql2/promise';
import { Pool as PgPool } from 'pg';

const isVercel = process.env.VERCEL === '1';

// MySQL Pool for localhost
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rahasia',
    database: process.env.DB_NAME || 'finance_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// PostgreSQL Pool for Vercel / Neon
const pgPool = new PgPool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const pool = {
    execute: async (sql: string, params: any[] = []) => {
        if (isVercel) {
            // Convert MySQL ? syntax to PostgreSQL $1, $2 syntax
            let counter = 1;
            const pgSql = sql.replace(/\?/g, () => `$${counter++}`);
            const res = await pgPool.query(pgSql, params);
            return [res.rows];
        } else {
            return await mysqlPool.execute(sql, params);
        }
    }
};