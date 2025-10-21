const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  console.log('🌱 Seeding database...');

  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  db.run(
    'INSERT OR IGNORE INTO users (id, name, email, password_hash, coins, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
    [999, 'Admin User', 'admin@askearn.com', adminPassword, 10000, 1]
  );

  // Create users
  db.run(
    'INSERT OR IGNORE INTO users (id, name, email, password_hash, coins) VALUES (?, ?, ?, ?, ?)',
    [1, 'Alice Johnson', 'alice@test.com', password, 150]
  );

  db.run(
    'INSERT OR IGNORE INTO users (id, name, email, password_hash, coins) VALUES (?, ?, ?, ?, ?)',
    [2, 'Bob Smith', 'bob@test.com', password, 200]
  );

  // Create questions
  db.run(
    `INSERT OR IGNORE INTO questions (id, user_id, title, description) VALUES (?, ?, ?, ?)`,
    [
      1,
      1,
      'How do I center a div in CSS?',
      'I have been trying to center a div element horizontally and vertically on my webpage but nothing seems to work. What is the best modern approach?',
    ]
  );

  db.run(
    `INSERT OR IGNORE INTO questions (id, user_id, title, description) VALUES (?, ?, ?, ?)`,
    [
      2,
      2,
      'What is the difference between let and var in JavaScript?',
      'I keep seeing both let and var used in JavaScript code. What are the key differences and when should I use each one?',
    ]
  );

  // Create answers
  db.run(
    `INSERT OR IGNORE INTO answers (id, question_id, user_id, body, reasoning, upvotes, reward_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      1,
      2,
      'Use Flexbox! Add display: flex; justify-content: center; align-items: center; to the parent container.',
      'Flexbox is the modern standard for centering elements. It works across all modern browsers and is much simpler than older methods like absolute positioning or table displays.',
      3,
      'pending',
    ]
  );

  db.run(
    `INSERT OR IGNORE INTO answers (id, question_id, user_id, body, reasoning, upvotes, reward_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      2,
      1,
      1,
      'You can also use CSS Grid: display: grid; place-items: center; on the parent.',
      'Grid is another modern approach that is even more concise. The place-items property is a shorthand for align-items and justify-items.',
      1,
      'pending',
    ]
  );

  db.run(
    `INSERT OR IGNORE INTO answers (id, question_id, user_id, body, reasoning, upvotes, reward_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      3,
      2,
      1,
      'The main difference is scope. var is function-scoped while let is block-scoped. Also, var gets hoisted while let does not.',
      'Block scoping with let prevents common bugs where variables leak outside their intended scope. This is why let is preferred in modern JavaScript.',
      6,
      'rewarded',
    ]
  );

  console.log('✅ Database seeded successfully!');
  console.log('📧 Test accounts:');
  console.log('   alice@test.com / password123');
  console.log('   bob@test.com / password123');
  console.log('');
  console.log('👑 Admin account:');
  console.log('   admin@askearn.com / admin123');

  db.close();
}

seed();
