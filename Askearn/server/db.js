// Use PostgreSQL in production (Supabase), SQLite in development
if (process.env.DATABASE_URL) {
  console.log('🐘 Using PostgreSQL (Supabase)');
  module.exports = require('./db-postgres');
} else {
  console.log('📁 Using SQLite (Development)');
  
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  
  const dbPath = path.join(__dirname, 'askearn.db');
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to SQLite database');
    }
  });

// Initialize database schema
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      coins INTEGER DEFAULT 100,
      is_admin INTEGER DEFAULT 0,
      is_banned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Answers table
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      reasoning TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      reward_status TEXT DEFAULT 'pending',
      paste_detected INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Upvotes table
  db.run(`
    CREATE TABLE IF NOT EXISTS upvotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      answer_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, answer_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (answer_id) REFERENCES answers(id)
    )
  `);

  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      last_ping DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      coins INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Withdrawals table
  db.run(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      coins INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // User profiles table (for signup assessment)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      personality_type TEXT,
      interests TEXT,
      skill_level TEXT,
      assessment_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Tasks table (predefined task levels)
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level INTEGER NOT NULL UNIQUE,
      question_count INTEGER NOT NULL,
      coins_per_question INTEGER DEFAULT 20,
      title TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Task questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      question_type TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    )
  `);

  // User task assignments table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline DATETIME NOT NULL,
      completed_at DATETIME,
      total_coins_earned INTEGER DEFAULT 0,
      questions_answered INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    )
  `);

  // Task answers table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_task_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      answer_text TEXT NOT NULL,
      ai_detection_score REAL DEFAULT 0,
      is_natural INTEGER DEFAULT 0,
      coins_awarded INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_task_id) REFERENCES user_tasks(id),
      FOREIGN KEY (question_id) REFERENCES task_questions(id)
    )
  `);

  // Seed default tasks
  db.run(`
    INSERT OR IGNORE INTO tasks (level, question_count, coins_per_question, title, description) VALUES
    (1, 5, 20, 'Beginner Task', 'Complete 5 questions to earn 100 coins'),
    (2, 15, 20, 'Intermediate Task', 'Complete 15 questions to earn 300 coins'),
    (3, 25, 20, 'Advanced Task', 'Complete 25 questions to earn 500 coins'),
    (4, 35, 20, 'Expert Task', 'Complete 35 questions to earn 700 coins'),
    (5, 50, 20, 'Master Task', 'Complete 50 questions to earn 1000 coins')
  `);
});

  module.exports = db;
}
