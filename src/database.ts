import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');
console.log('Connected to SQLite database');

// Set pragmas for better performance
db.pragma('journal_mode = WAL');

// Wrapper functions for database methods with proper typing
export const dbRun = (sql: string, params: any[] = []): { lastID: number; changes: number } => {
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    lastID: Number(result.lastInsertRowid),
    changes: result.changes
  };
};

export const dbGet = <T = any>(sql: string, params: any[] = []): T | undefined => {
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
};

export const dbAll = <T = any>(sql: string, params: any[] = []): T[] => {
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
};

// Initialize database schema
export const initDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    dbRun(createTableQuery);
    console.log('Posts table initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db;
