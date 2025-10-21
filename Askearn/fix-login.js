const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'askearn.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking login issues...\n');

// Check if users table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, table) => {
  if (err) {
    console.error('❌ Database error:', err);
    return;
  }

  if (!table) {
    console.log('❌ Users table does not exist!');
    console.log('✅ Solution: Run "npm run seed" to create the database\n');
    db.close();
    return;
  }

  console.log('✅ Users table exists\n');

  // Check if there are any users
  db.all('SELECT id, name, email, coins, is_admin FROM users', (err, users) => {
    if (err) {
      console.error('❌ Error reading users:', err);
      db.close();
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('✅ Solution: Run "npm run seed" to create test users\n');
      db.close();
      return;
    }

    console.log(`✅ Found ${users.length} users:\n`);
    users.forEach(user => {
      console.log(`   📧 ${user.email}`);
      console.log(`      Name: ${user.name}`);
      console.log(`      Coins: ${user.coins}`);
      console.log(`      Admin: ${user.is_admin ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Test password for alice
    db.get('SELECT * FROM users WHERE email = ?', ['alice@test.com'], async (err, user) => {
      if (user) {
        console.log('🔐 Testing password for alice@test.com...');
        try {
          const isValid = await bcrypt.compare('password123', user.password_hash);
          if (isValid) {
            console.log('✅ Password "password123" is correct for alice@test.com\n');
          } else {
            console.log('❌ Password "password123" does NOT match!\n');
            console.log('✅ Solution: Run "npm run seed" to reset passwords\n');
          }
        } catch (error) {
          console.error('❌ Error testing password:', error);
        }
      }

      // Test password for admin
      db.get('SELECT * FROM users WHERE email = ?', ['admin@askearn.com'], async (err, user) => {
        if (user) {
          console.log('🔐 Testing password for admin@askearn.com...');
          try {
            const isValid = await bcrypt.compare('admin123', user.password_hash);
            if (isValid) {
              console.log('✅ Password "admin123" is correct for admin@askearn.com\n');
            } else {
              console.log('❌ Password "admin123" does NOT match!\n');
              console.log('✅ Solution: Run "npm run seed" to reset passwords\n');
            }
          } catch (error) {
            console.error('❌ Error testing password:', error);
          }
        } else {
          console.log('❌ Admin user not found!');
          console.log('✅ Solution: Run "npm run seed" to create admin user\n');
        }

        console.log('\n📋 Summary:');
        console.log('───────────────────────────────────────────────');
        console.log('If you see any ❌ above, run this command:');
        console.log('\n   npm run seed\n');
        console.log('Then try logging in again with:');
        console.log('   📧 alice@test.com / password123');
        console.log('   📧 bob@test.com / password123');
        console.log('   📧 admin@askearn.com / admin123');
        console.log('───────────────────────────────────────────────\n');

        db.close();
      });
    });
  });
});
