const db = require('./db');

// Sample questions for each task level
const taskQuestions = {
  1: [ // 5 questions for level 1
    "What is your favorite hobby and why do you enjoy it?",
    "Describe a memorable moment from your childhood.",
    "What motivates you to wake up every morning?",
    "If you could learn any skill instantly, what would it be?",
    "What is one thing you're grateful for today?"
  ],
  2: [ // 15 questions for level 2
    "What is your favorite hobby and why do you enjoy it?",
    "Describe a memorable moment from your childhood.",
    "What motivates you to wake up every morning?",
    "If you could learn any skill instantly, what would it be?",
    "What is one thing you're grateful for today?",
    "How do you handle stress in your daily life?",
    "What's your dream job and why?",
    "Describe your ideal weekend.",
    "What book or movie has influenced you the most?",
    "If you could travel anywhere, where would you go?",
    "What's the best advice you've ever received?",
    "How do you define success?",
    "What's your favorite food and why?",
    "Describe a challenge you've overcome.",
    "What makes you unique?"
  ],
  3: [ // 25 questions for level 3
    "What is your favorite hobby and why do you enjoy it?",
    "Describe a memorable moment from your childhood.",
    "What motivates you to wake up every morning?",
    "If you could learn any skill instantly, what would it be?",
    "What is one thing you're grateful for today?",
    "How do you handle stress in your daily life?",
    "What's your dream job and why?",
    "Describe your ideal weekend.",
    "What book or movie has influenced you the most?",
    "If you could travel anywhere, where would you go?",
    "What's the best advice you've ever received?",
    "How do you define success?",
    "What's your favorite food and why?",
    "Describe a challenge you've overcome.",
    "What makes you unique?",
    "What are your top three values in life?",
    "How do you stay productive?",
    "What's your biggest fear and how do you face it?",
    "Describe your perfect day.",
    "What skill are you currently working on?",
    "Who is your role model and why?",
    "What's the most important lesson life has taught you?",
    "How do you make important decisions?",
    "What's your favorite way to relax?",
    "If you could change one thing about the world, what would it be?"
  ],
  4: [ // 35 questions for level 4
    "What is your favorite hobby and why do you enjoy it?",
    "Describe a memorable moment from your childhood.",
    "What motivates you to wake up every morning?",
    "If you could learn any skill instantly, what would it be?",
    "What is one thing you're grateful for today?",
    "How do you handle stress in your daily life?",
    "What's your dream job and why?",
    "Describe your ideal weekend.",
    "What book or movie has influenced you the most?",
    "If you could travel anywhere, where would you go?",
    "What's the best advice you've ever received?",
    "How do you define success?",
    "What's your favorite food and why?",
    "Describe a challenge you've overcome.",
    "What makes you unique?",
    "What are your top three values in life?",
    "How do you stay productive?",
    "What's your biggest fear and how do you face it?",
    "Describe your perfect day.",
    "What skill are you currently working on?",
    "Who is your role model and why?",
    "What's the most important lesson life has taught you?",
    "How do you make important decisions?",
    "What's your favorite way to relax?",
    "If you could change one thing about the world, what would it be?",
    "What does friendship mean to you?",
    "How do you handle failure?",
    "What's your morning routine?",
    "Describe your biggest achievement.",
    "What's your favorite season and why?",
    "How do you stay motivated during tough times?",
    "What's your philosophy on life?",
    "Describe a person who has impacted your life.",
    "What are your long-term goals?",
    "How do you balance work and personal life?"
  ],
  5: [ // 50 questions for level 5
    "What is your favorite hobby and why do you enjoy it?",
    "Describe a memorable moment from your childhood.",
    "What motivates you to wake up every morning?",
    "If you could learn any skill instantly, what would it be?",
    "What is one thing you're grateful for today?",
    "How do you handle stress in your daily life?",
    "What's your dream job and why?",
    "Describe your ideal weekend.",
    "What book or movie has influenced you the most?",
    "If you could travel anywhere, where would you go?",
    "What's the best advice you've ever received?",
    "How do you define success?",
    "What's your favorite food and why?",
    "Describe a challenge you've overcome.",
    "What makes you unique?",
    "What are your top three values in life?",
    "How do you stay productive?",
    "What's your biggest fear and how do you face it?",
    "Describe your perfect day.",
    "What skill are you currently working on?",
    "Who is your role model and why?",
    "What's the most important lesson life has taught you?",
    "How do you make important decisions?",
    "What's your favorite way to relax?",
    "If you could change one thing about the world, what would it be?",
    "What does friendship mean to you?",
    "How do you handle failure?",
    "What's your morning routine?",
    "Describe your biggest achievement.",
    "What's your favorite season and why?",
    "How do you stay motivated during tough times?",
    "What's your philosophy on life?",
    "Describe a person who has impacted your life.",
    "What are your long-term goals?",
    "How do you balance work and personal life?",
    "What's your favorite memory with family?",
    "How do you practice self-care?",
    "What's the most adventurous thing you've done?",
    "Describe your ideal career path.",
    "What habits are you trying to build?",
    "How do you handle criticism?",
    "What's your favorite quote and why?",
    "Describe a time you helped someone.",
    "What are you passionate about?",
    "How do you stay organized?",
    "What's your biggest regret and what did you learn?",
    "Describe your communication style.",
    "What's your approach to learning new things?",
    "How do you celebrate your successes?",
    "What legacy do you want to leave behind?"
  ]
};

// Seed task questions
function seedTaskQuestions() {
  console.log('🌱 Seeding task questions...');

  // Get all tasks
  db.all('SELECT * FROM tasks ORDER BY level', (err, tasks) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return;
    }

    tasks.forEach(task => {
      const questions = taskQuestions[task.level];
      
      if (!questions) {
        console.log(`⚠️  No questions defined for level ${task.level}`);
        return;
      }

      // Check if questions already exist for this task
      db.get('SELECT COUNT(*) as count FROM task_questions WHERE task_id = ?', [task.id], (err, result) => {
        if (err) {
          console.error(`Error checking questions for task ${task.id}:`, err);
          return;
        }

        if (result.count > 0) {
          console.log(`✓ Task ${task.level} already has questions (${result.count})`);
          return;
        }

        // Insert questions
        const stmt = db.prepare('INSERT INTO task_questions (task_id, question_text) VALUES (?, ?)');
        
        questions.forEach((question, index) => {
          stmt.run(task.id, question, (err) => {
            if (err) {
              console.error(`Error inserting question ${index + 1} for task ${task.level}:`, err);
            }
          });
        });

        stmt.finalize(() => {
          console.log(`✓ Added ${questions.length} questions for Task Level ${task.level}`);
        });
      });
    });
  });

  setTimeout(() => {
    console.log('✅ Task questions seeding completed!');
    db.close();
  }, 2000);
}

// Run seeding
seedTaskQuestions();
