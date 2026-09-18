import mysql from 'mysql2/promise';

const hasDbConfig = Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);

export const pool = hasDbConfig
  ? mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10
    })
  : null;

