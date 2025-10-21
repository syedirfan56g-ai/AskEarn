const { Pool } = require('pg');

// PostgreSQL connection for production (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database (Supabase)');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database schema
const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        coins INTEGER DEFAULT 100,
        is_admin INTEGER DEFAULT 0,
        is_banned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        body TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        reward_status TEXT DEFAULT 'pending',
        paste_detected INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Upvotes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS upvotes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        answer_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, answer_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
      )
    `);

    // Sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        coins INTEGER NOT NULL,
        payment_method TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        transaction_id TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Withdrawals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        coins INTEGER NOT NULL,
        payment_method TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // User profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        personality_type TEXT,
        interests TEXT,
        skill_level TEXT,
        assessment_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        level INTEGER NOT NULL UNIQUE,
        question_count INTEGER NOT NULL,
        coins_per_question INTEGER DEFAULT 20,
        title TEXT NOT NULL,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Task questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS task_questions (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        question_type TEXT DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // User task assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        task_id INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deadline TIMESTAMP NOT NULL,
        completed_at TIMESTAMP,
        total_coins_earned INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // Task answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS task_answers (
        id SERIAL PRIMARY KEY,
        user_task_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        answer_text TEXT NOT NULL,
        ai_detection_score REAL DEFAULT 0,
        is_natural INTEGER DEFAULT 0,
        coins_awarded INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_task_id) REFERENCES user_tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES task_questions(id) ON DELETE CASCADE
      )
    `);

    // Seed default tasks
    await client.query(`
      INSERT INTO tasks (level, question_count, coins_per_question, title, description) 
      VALUES
        (1, 5, 20, 'Beginner Task', 'Complete 5 questions to earn 100 coins'),
        (2, 15, 20, 'Intermediate Task', 'Complete 15 questions to earn 300 coins'),
        (3, 25, 20, 'Advanced Task', 'Complete 25 questions to earn 500 coins'),
        (4, 35, 20, 'Expert Task', 'Complete 35 questions to earn 700 coins'),
        (5, 50, 20, 'Master Task', 'Complete 50 questions to earn 1000 coins')
      ON CONFLICT (level) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Database schema initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Initialize on startup
initDatabase().catch(console.error);

// Export query function for compatibility with SQLite code
const db = {
  query: (text, params) => pool.query(text, params),
  
  // SQLite-style methods for backward compatibility
  run: async (sql, params = [], callback) => {
    try {
      const result = await pool.query(sql, params);
      if (callback) callback(null, result);
      return result;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  },
  
  get: async (sql, params = [], callback) => {
    try {
      const result = await pool.query(sql, params);
      const row = result.rows[0] || null;
      if (callback) callback(null, row);
      return row;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  },
  
  all: async (sql, params = [], callback) => {
    try {
      const result = await pool.query(sql, params);
      if (callback) callback(null, result.rows);
      return result.rows;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }
};

module.exports = db;
