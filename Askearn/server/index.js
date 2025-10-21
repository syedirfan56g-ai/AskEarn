const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { authenticateToken, authenticateAdmin, generateToken } = require('./auth');
const { calculateAIScore, isNaturalAnswer, analyzeText } = require('./aiDetection');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://askearn.vercel.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// ==================== AUTH ROUTES ====================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Server error' });
        }

        const token = generateToken({ id: this.lastID, email, name });
        res.cookie('token', token, { 
          httpOnly: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        res.json({ message: 'User created', user: { id: this.lastID, name, email, coins: 100 } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name, is_admin: user.is_admin });
      res.cookie('token', token, { 
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          coins: user.coins,
        },
      });
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
});

// Firebase Auth Login/Signup
app.post('/api/auth/firebase', async (req, res) => {
  const { uid, email, name, photo, provider } = req.body;

  if (!email || !name || !uid) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (user) {
        // User exists, create token and return
        const token = generateToken({ 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          is_admin: user.is_admin 
        });
        
        res.cookie('token', token, { 
          httpOnly: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        return res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            coins: user.coins,
            is_admin: user.is_admin,
          },
        });
      } else {
        // Create new user
        db.run(
          'INSERT INTO users (name, email, password_hash, coins) VALUES (?, ?, ?, ?)',
          [name, email, `firebase_${uid}`, 100],
          function (err) {
            if (err) {
              console.error('Insert error:', err);
              return res.status(500).json({ error: 'Server error' });
            }

            const token = generateToken({ 
              id: this.lastID, 
              email, 
              name, 
              is_admin: 0 
            });
            
            res.cookie('token', token, { 
              httpOnly: true, 
              maxAge: 7 * 24 * 60 * 60 * 1000,
              sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
              secure: process.env.NODE_ENV === 'production'
            });

            return res.json({
              user: {
                id: this.lastID,
                name,
                email,
                coins: 100,
                is_admin: 0,
              },
            });
          }
        );
      }
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, coins, is_admin FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { ...user, isAdmin: user.is_admin === 1 } });
  });
});

// ==================== QUESTIONS ROUTES ====================

// Get all questions
app.get('/api/questions', (req, res) => {
  db.all(
    `SELECT q.*, u.name as author_name, 
     (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
     FROM questions q 
     JOIN users u ON q.user_id = u.id 
     ORDER BY q.created_at DESC`,
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ questions });
    }
  );
});

// Get single question with answers
app.get('/api/questions/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT q.*, u.name as author_name FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = ?',
    [id],
    (err, question) => {
      if (err || !question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      db.all(
        `SELECT a.*, u.name as author_name 
         FROM answers a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.question_id = ? 
         ORDER BY a.upvotes DESC, a.created_at DESC`,
        [id],
        (err, answers) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }
          res.json({ question, answers });
        }
      );
    }
  );
});

// Create question
app.post('/api/questions', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  db.run(
    'INSERT INTO questions (user_id, title, description) VALUES (?, ?, ?)',
    [req.user.id, title, description],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Question created', questionId: this.lastID });
    }
  );
});

// ==================== ANSWERS ROUTES ====================

// Submit answer
app.post('/api/questions/:id/answers', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { body, reasoning, pasteDetected } = req.body;

  if (!body || !reasoning) {
    return res.status(400).json({ error: 'Answer and reasoning are required' });
  }

  db.run(
    'INSERT INTO answers (question_id, user_id, body, reasoning, paste_detected) VALUES (?, ?, ?, ?, ?)',
    [id, req.user.id, body, reasoning, pasteDetected ? 1 : 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Answer submitted', answerId: this.lastID });
    }
  );
});

// Upvote answer
app.post('/api/answers/:id/upvote', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Check if user has enough coins
  db.get('SELECT coins FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.coins < 1) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    // Check if already upvoted
    db.get(
      'SELECT * FROM upvotes WHERE user_id = ? AND answer_id = ?',
      [req.user.id, id],
      (err, existingUpvote) => {
        if (existingUpvote) {
          return res.status(400).json({ error: 'Already upvoted' });
        }

        // Get answer details
        db.get('SELECT * FROM answers WHERE id = ?', [id], (err, answer) => {
          if (err || !answer) {
            return res.status(404).json({ error: 'Answer not found' });
          }

          // Deduct coin from upvoter
          db.run('UPDATE users SET coins = coins - 1 WHERE id = ?', [req.user.id]);

          // Add upvote
          db.run(
            'INSERT INTO upvotes (user_id, answer_id) VALUES (?, ?)',
            [req.user.id, id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Server error' });
              }

              // Increment upvote count
              db.run('UPDATE answers SET upvotes = upvotes + 1 WHERE id = ?', [id]);

              // Check if answer should be rewarded (5+ upvotes)
              const newUpvotes = answer.upvotes + 1;
              if (newUpvotes >= 5 && answer.reward_status === 'pending') {
                const rewardAmount = answer.paste_detected ? 5 : 10;
                db.run('UPDATE users SET coins = coins + ? WHERE id = ?', [
                  rewardAmount,
                  answer.user_id,
                ]);
                db.run("UPDATE answers SET reward_status = 'rewarded' WHERE id = ?", [id]);
              }

              res.json({ message: 'Upvoted successfully' });
            }
          );
        });
      }
    );
  });
});

// ==================== SESSION ROUTES ====================

// Heartbeat ping
app.post('/api/session/ping', authenticateToken, (req, res) => {
  db.run(
    'INSERT OR REPLACE INTO sessions (user_id, last_ping, active) VALUES (?, CURRENT_TIMESTAMP, 1)',
    [req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Ping received' });
    }
  );
});

// Reset session
app.post('/api/session/reset', authenticateToken, (req, res) => {
  db.run('UPDATE sessions SET active = 0 WHERE user_id = ?', [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Session reset' });
  });
});

// ==================== LEADERBOARD ROUTE ====================

app.get('/api/leaderboard', (req, res) => {
  db.all(
    'SELECT id, name, email, coins FROM users ORDER BY coins DESC LIMIT 10',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ users });
    }
  );
});

// ==================== WALLET ROUTE ====================

app.get('/api/wallet/history', authenticateToken, (req, res) => {
  // Get answer rewards
  db.all(
    `SELECT 'reward' as type, a.created_at, 
     CASE WHEN a.paste_detected = 1 THEN 5 ELSE 10 END as amount,
     'Answer reward' as description
     FROM answers a 
     WHERE a.user_id = ? AND a.reward_status = 'rewarded'
     ORDER BY a.created_at DESC LIMIT 20`,
    [req.user.id],
    (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ history });
    }
  );
});

// ==================== PAYMENT ROUTES ====================

// Get coin packages
app.get('/api/payments/packages', (req, res) => {
  const packages = [
    { id: 1, coins: 100, price: 100, currency: 'PKR' },
    { id: 2, coins: 500, price: 450, currency: 'PKR', discount: '10%' },
    { id: 3, coins: 1000, price: 850, currency: 'PKR', discount: '15%' },
    { id: 4, coins: 5000, price: 4000, currency: 'PKR', discount: '20%' },
  ];
  res.json({ packages });
});

// Create payment
app.post('/api/payments/create', authenticateToken, (req, res) => {
  const { amount, coins, paymentMethod, phoneNumber, transactionId } = req.body;

  if (!amount || !coins || !paymentMethod || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO payments (user_id, amount, coins, payment_method, phone_number, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, amount, coins, paymentMethod, phoneNumber, transactionId || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Payment submitted for verification', paymentId: this.lastID });
    }
  );
});

// Get user payments
app.get('/api/payments/my-payments', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, payments) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ payments });
    }
  );
});

// ==================== ADMIN ROUTES ====================

// Admin Dashboard Stats
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM users WHERE is_admin = 0', (err, result) => {
    stats.totalUsers = result?.count || 0;

    db.get('SELECT COUNT(*) as count FROM questions', (err, result) => {
      stats.totalQuestions = result?.count || 0;

      db.get('SELECT COUNT(*) as count FROM answers', (err, result) => {
        stats.totalAnswers = result?.count || 0;

        db.get('SELECT COUNT(*) as count FROM payments WHERE status = "pending"', (err, result) => {
          stats.pendingPayments = result?.count || 0;

          db.get('SELECT SUM(coins) as total FROM users WHERE is_admin = 0', (err, result) => {
            stats.totalCoins = result?.total || 0;

            res.json({ stats });
          });
        });
      });
    });
  });
});

// Get all users (admin)
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  db.all(
    'SELECT id, name, email, coins, is_banned, created_at FROM users WHERE is_admin = 0 ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ users });
    }
  );
});

// Ban/Unban user
app.post('/api/admin/users/:id/ban', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { banned } = req.body;

  db.run('UPDATE users SET is_banned = ? WHERE id = ?', [banned ? 1 : 0, id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: banned ? 'User banned' : 'User unbanned' });
  });
});

// Delete user
app.delete('/api/admin/users/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'User deleted' });
  });
});

// Get all questions (admin)
app.get('/api/admin/questions', authenticateAdmin, (req, res) => {
  db.all(
    `SELECT q.*, u.name as author_name, 
     (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
     FROM questions q 
     JOIN users u ON q.user_id = u.id 
     ORDER BY q.created_at DESC`,
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ questions });
    }
  );
});

// Delete question
app.delete('/api/admin/questions/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM questions WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Question deleted' });
  });
});

// Get all answers (admin)
app.get('/api/admin/answers', authenticateAdmin, (req, res) => {
  db.all(
    `SELECT a.*, u.name as author_name, q.title as question_title
     FROM answers a 
     JOIN users u ON a.user_id = u.id 
     JOIN questions q ON a.question_id = q.id
     ORDER BY a.created_at DESC`,
    (err, answers) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ answers });
    }
  );
});

// Delete answer
app.delete('/api/admin/answers/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM answers WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Answer deleted' });
  });
});

// Get all payments (admin)
app.get('/api/admin/payments', authenticateAdmin, (req, res) => {
  db.all(
    `SELECT p.*, u.name as user_name, u.email as user_email
     FROM payments p 
     JOIN users u ON p.user_id = u.id 
     ORDER BY p.created_at DESC`,
    (err, payments) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ payments });
    }
  );
});

// Approve payment
app.post('/api/admin/payments/:id/approve', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM payments WHERE id = ?', [id], (err, payment) => {
    if (err || !payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    db.run('UPDATE payments SET status = ? WHERE id = ?', ['approved', id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      db.run('UPDATE users SET coins = coins + ? WHERE id = ?', [payment.coins, payment.user_id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }
        res.json({ message: 'Payment approved and coins added' });
      });
    });
  });
});

// Reject payment
app.post('/api/admin/payments/:id/reject', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('UPDATE payments SET status = ? WHERE id = ?', ['rejected', id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Payment rejected' });
  });
});

// ==================== TASK ROUTES ====================

// Get all available tasks
app.get('/api/tasks', (req, res) => {
  db.all(
    'SELECT * FROM tasks WHERE is_active = 1 ORDER BY level',
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ tasks });
    }
  );
});

// Get user's active task
app.get('/api/tasks/active', authenticateToken, (req, res) => {
  db.get(
    `SELECT ut.*, t.title, t.question_count, t.coins_per_question, t.level
     FROM user_tasks ut
     JOIN tasks t ON ut.task_id = t.id
     WHERE ut.user_id = ? AND ut.status = 'active'
     ORDER BY ut.started_at DESC
     LIMIT 1`,
    [req.user.id],
    (err, task) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (!task) {
        return res.json({ task: null });
      }

      // Check if deadline passed
      const now = new Date();
      const deadline = new Date(task.deadline);
      
      if (now > deadline && task.status === 'active') {
        // Mark as expired
        db.run('UPDATE user_tasks SET status = ? WHERE id = ?', ['expired', task.id]);
        return res.json({ task: null, message: 'Previous task expired' });
      }

      res.json({ task });
    }
  );
});

// Start a new task
app.post('/api/tasks/:taskId/start', authenticateToken, (req, res) => {
  const { taskId } = req.params;

  // Check if user has an active task
  db.get(
    'SELECT * FROM user_tasks WHERE user_id = ? AND status = ?',
    [req.user.id, 'active'],
    (err, activeTask) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (activeTask) {
        return res.status(400).json({ error: 'You already have an active task. Complete it first.' });
      }

      // Get task details
      db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
        if (err || !task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        // Calculate deadline (24 hours from now)
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 24);

        // Create user task
        db.run(
          'INSERT INTO user_tasks (user_id, task_id, deadline) VALUES (?, ?, ?)',
          [req.user.id, taskId, deadline.toISOString()],
          function (err) {
            if (err) {
              return res.status(500).json({ error: 'Server error' });
            }

            res.json({
              message: 'Task started successfully',
              userTaskId: this.lastID,
              deadline: deadline.toISOString(),
              task
            });
          }
        );
      });
    }
  );
});

// Get questions for a task
app.get('/api/tasks/:userTaskId/questions', authenticateToken, (req, res) => {
  const { userTaskId } = req.params;

  // Verify user owns this task
  db.get(
    'SELECT * FROM user_tasks WHERE id = ? AND user_id = ?',
    [userTaskId, req.user.id],
    (err, userTask) => {
      if (err || !userTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Get questions for this task
      db.all(
        'SELECT * FROM task_questions WHERE task_id = ? ORDER BY id',
        [userTask.task_id],
        (err, questions) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }

          // Get already answered questions
          db.all(
            'SELECT question_id FROM task_answers WHERE user_task_id = ?',
            [userTaskId],
            (err, answers) => {
              if (err) {
                return res.status(500).json({ error: 'Server error' });
              }

              const answeredIds = answers.map(a => a.question_id);
              const questionsWithStatus = questions.map(q => ({
                ...q,
                answered: answeredIds.includes(q.id)
              }));

              res.json({ questions: questionsWithStatus });
            }
          );
        }
      );
    }
  );
});

// Submit answer to a task question
app.post('/api/tasks/:userTaskId/answer', authenticateToken, (req, res) => {
  const { userTaskId } = req.params;
  const { questionId, answerText } = req.body;

  if (!answerText || answerText.trim().length < 10) {
    return res.status(400).json({ error: 'Answer must be at least 10 characters' });
  }

  // Verify user owns this task
  db.get(
    'SELECT ut.*, t.coins_per_question FROM user_tasks ut JOIN tasks t ON ut.task_id = t.id WHERE ut.id = ? AND ut.user_id = ?',
    [userTaskId, req.user.id],
    (err, userTask) => {
      if (err || !userTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (userTask.status !== 'active') {
        return res.status(400).json({ error: 'Task is not active' });
      }

      // Check deadline
      const now = new Date();
      const deadline = new Date(userTask.deadline);
      if (now > deadline) {
        db.run('UPDATE user_tasks SET status = ? WHERE id = ?', ['expired', userTaskId]);
        return res.status(400).json({ error: 'Task deadline has passed' });
      }

      // Check if already answered
      db.get(
        'SELECT * FROM task_answers WHERE user_task_id = ? AND question_id = ?',
        [userTaskId, questionId],
        (err, existing) => {
          if (existing) {
            return res.status(400).json({ error: 'Question already answered' });
          }

          // Analyze answer with AI detection
          const analysis = analyzeText(answerText);
          const coinsAwarded = analysis.isNatural ? userTask.coins_per_question : 0;

          // Save answer
          db.run(
            'INSERT INTO task_answers (user_task_id, question_id, answer_text, ai_detection_score, is_natural, coins_awarded) VALUES (?, ?, ?, ?, ?, ?)',
            [userTaskId, questionId, answerText, analysis.score, analysis.isNatural ? 1 : 0, coinsAwarded],
            function (err) {
              if (err) {
                return res.status(500).json({ error: 'Server error' });
              }

              // Update user task progress
              const newQuestionsAnswered = userTask.questions_answered + 1;
              const newTotalCoins = userTask.total_coins_earned + coinsAwarded;

              db.run(
                'UPDATE user_tasks SET questions_answered = ?, total_coins_earned = ? WHERE id = ?',
                [newQuestionsAnswered, newTotalCoins, userTaskId],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Server error' });
                  }

                  // Award coins to user if natural
                  if (analysis.isNatural) {
                    db.run('UPDATE users SET coins = coins + ? WHERE id = ?', [coinsAwarded, req.user.id]);
                  }

                  // Check if task completed
                  db.get('SELECT question_count FROM tasks WHERE id = ?', [userTask.task_id], (err, task) => {
                    if (newQuestionsAnswered >= task.question_count) {
                      db.run('UPDATE user_tasks SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?', ['completed', userTaskId]);
                    }

                    res.json({
                      message: 'Answer submitted successfully',
                      analysis: {
                        isNatural: analysis.isNatural,
                        coinsAwarded,
                        verdict: analysis.verdict
                      },
                      progress: {
                        answered: newQuestionsAnswered,
                        total: task.question_count,
                        totalCoinsEarned: newTotalCoins
                      }
                    });
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Get task history
app.get('/api/tasks/history', authenticateToken, (req, res) => {
  db.all(
    `SELECT ut.*, t.title, t.question_count, t.level
     FROM user_tasks ut
     JOIN tasks t ON ut.task_id = t.id
     WHERE ut.user_id = ?
     ORDER BY ut.started_at DESC`,
    [req.user.id],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ tasks });
    }
  );
});

// ==================== USER PROFILE ROUTES ====================

// Save user profile (during signup assessment)
app.post('/api/profile/assessment', authenticateToken, (req, res) => {
  const { personalityType, interests, skillLevel, assessmentData } = req.body;

  db.run(
    `INSERT OR REPLACE INTO user_profiles (user_id, personality_type, interests, skill_level, assessment_data)
     VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, personalityType, interests, skillLevel, JSON.stringify(assessmentData)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Profile saved successfully' });
    }
  );
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT * FROM user_profiles WHERE user_id = ?',
    [req.user.id],
    (err, profile) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (profile && profile.assessment_data) {
        profile.assessment_data = JSON.parse(profile.assessment_data);
      }
      
      res.json({ profile });
    }
  );
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
