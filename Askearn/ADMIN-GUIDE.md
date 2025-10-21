# 👑 AskEarn Admin Panel Guide

Complete guide for administrators to manage the AskEarn platform.

---

## 🔐 Admin Access

### Admin Credentials
- **Email:** `admin@askearn.com`
- **Password:** `admin123`

### Accessing Admin Panel
1. Login with admin credentials
2. Click the **Shield icon** in the navbar
3. Or navigate directly to: `http://localhost:3000/admin`

---

## 📊 Admin Dashboard

The main dashboard shows:
- **Total Users**: Number of registered users
- **Total Questions**: All questions posted
- **Total Answers**: All answers submitted
- **Pending Payments**: Payments awaiting approval
- **Total Coins**: Coins in circulation

### Quick Actions
- Manage Users
- Manage Questions
- Manage Answers
- Manage Payments

---

## 👥 User Management

**Route:** `/admin/users`

### Features
- View all registered users
- See user details (name, email, coins, join date)
- Check user status (Active/Banned)

### Actions

#### Ban User
1. Click the **Ban icon** (yellow button)
2. Confirm the action
3. User will be banned from the platform

#### Unban User
1. Click the **Check icon** (green button) on banned user
2. Confirm the action
3. User will be unbanned

#### Delete User
1. Click the **Trash icon** (red button)
2. Confirm deletion (cannot be undone)
3. User and all their data will be deleted

---

## ❓ Question Management

**Route:** `/admin/questions`

### Features
- View all questions posted
- See question details and answer count
- See who posted each question

### Actions

#### Delete Question
1. Click the **Trash icon** on any question
2. Confirm deletion
3. Question and all its answers will be deleted

**Use Cases:**
- Remove spam questions
- Delete inappropriate content
- Clean up duplicate questions

---

## 💬 Answer Management

**Route:** `/admin/answers`

### Features
- View all answers submitted
- See answer content and reasoning
- Check upvotes and reward status
- Identify paste-detected answers

### Actions

#### Delete Answer
1. Click the **Trash icon** on any answer
2. Confirm deletion
3. Answer will be permanently removed

**Use Cases:**
- Remove spam answers
- Delete plagiarized content
- Remove inappropriate responses

---

## 💳 Payment Management (MOST IMPORTANT)

**Route:** `/admin/payments`

This is the core feature for managing EasyPaisa and JazzCash payments.

### Payment Flow

1. **User submits payment:**
   - User goes to "Buy Coins" page
   - Selects a coin package
   - Sends money via EasyPaisa/JazzCash
   - Submits payment details with phone number

2. **Admin receives notification:**
   - Payment appears in admin panel with "Pending" status
   - Shows user details, amount, coins, payment method, phone number

3. **Admin verifies payment:**
   - Check EasyPaisa/JazzCash account
   - Verify transaction from user's phone number
   - Match transaction ID (if provided)

4. **Admin approves/rejects:**
   - **Approve**: Coins added to user account automatically
   - **Reject**: Payment marked as rejected, no coins added

### Payment Details Shown

| Field | Description |
|-------|-------------|
| User | Name and email of buyer |
| Amount | PKR amount paid |
| Coins | Number of coins to be credited |
| Method | EasyPaisa or JazzCash |
| Phone | User's phone number |
| Transaction ID | Optional transaction reference |
| Status | Pending/Approved/Rejected |
| Date | When payment was submitted |

### Actions

#### Approve Payment
1. Verify the payment in your EasyPaisa/JazzCash account
2. Click the **Green Check icon**
3. Confirm approval
4. ✅ Coins automatically added to user account
5. Status changes to "Approved"

#### Reject Payment
1. If payment not received or invalid
2. Click the **Red X icon**
3. Confirm rejection
4. ❌ No coins added
5. Status changes to "Rejected"

### Filter Payments
Use the filter buttons to view:
- **All**: All payments
- **Pending**: Awaiting approval
- **Approved**: Successfully processed
- **Rejected**: Declined payments

### Best Practices

✅ **DO:**
- Verify every payment before approving
- Check phone numbers match
- Keep records of transaction IDs
- Respond to payments within 24 hours
- Contact users if payment details unclear

❌ **DON'T:**
- Approve without verification
- Reject without checking first
- Delay payment processing
- Share admin credentials

---

## 💰 Coin Packages

Current packages available for purchase:

| Package | Coins | Price (PKR) | Discount |
|---------|-------|-------------|----------|
| Starter | 100 | 100 | - |
| Popular | 500 | 450 | 10% |
| Premium | 1000 | 850 | 15% |
| Ultimate | 5000 | 4000 | 20% |

**Note:** You can modify packages in `server/index.js` under the `/api/payments/packages` route.

---

## 🔔 Payment Instructions for Users

Users see these instructions when buying coins:

1. Send PKR amount to: **03XX-XXXXXXX** (Update this number!)
2. Enter their phone number
3. Enter transaction ID (optional)
4. Submit for admin verification
5. Wait for approval (usually within 24 hours)

**⚠️ IMPORTANT:** Update the payment phone number in:
- `app/buy-coins/page.js` (line ~165)
- Replace `03XX-XXXXXXX` with your actual EasyPaisa/JazzCash number

---

## 📱 Setting Up Payment Accounts

### EasyPaisa Setup
1. Create EasyPaisa merchant account
2. Get your account number
3. Update in the payment instructions
4. Test with small transaction

### JazzCash Setup
1. Create JazzCash merchant account
2. Get your account number
3. Update in the payment instructions
4. Test with small transaction

---

## 🛡️ Security Features

### Admin Protection
- Admin routes require authentication
- Admin middleware checks `isAdmin` flag
- JWT tokens include admin status
- Regular users cannot access admin panel

### Payment Security
- All payments require manual approval
- Phone numbers recorded for verification
- Transaction IDs help prevent fraud
- Payment history maintained

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Daily active users
- Questions posted per day
- Answers submitted per day
- Payment conversion rate
- Average coins per user
- Pending payment response time

### Regular Tasks
- [ ] Check pending payments daily
- [ ] Review flagged content
- [ ] Monitor user activity
- [ ] Backup database weekly
- [ ] Update coin packages as needed

---

## 🚨 Handling Issues

### User Reports Spam
1. Go to Questions/Answers management
2. Find the reported content
3. Review for policy violations
4. Delete if inappropriate

### Payment Dispute
1. Check payment records in admin panel
2. Verify transaction in payment account
3. Contact user if needed
4. Approve or reject with explanation

### User Ban Request
1. Review user's activity
2. Check for violations
3. Ban user if necessary
4. Can unban later if resolved

---

## 🔧 Admin Configuration

### Adding New Admin
Currently, admins are created via database. To add a new admin:

1. Run seed script with new admin user
2. Or manually update database:
   ```sql
   UPDATE users SET is_admin = 1 WHERE email = 'newemail@example.com';
   ```

### Changing Admin Password
1. Login as admin
2. Use password reset feature (if implemented)
3. Or update database directly with bcrypt hash

---

## 📞 Support & Maintenance

### Common Admin Tasks

**Daily:**
- Approve/reject pending payments
- Review new questions/answers
- Check for spam

**Weekly:**
- Review user statistics
- Update coin packages if needed
- Backup database

**Monthly:**
- Analyze payment trends
- Review top users
- Plan promotions

---

## 🎯 Tips for Effective Management

1. **Fast Payment Processing**: Approve payments quickly to keep users happy
2. **Clear Communication**: If rejecting payment, contact user with reason
3. **Monitor Trends**: Watch for unusual activity patterns
4. **Regular Backups**: Always backup database before major changes
5. **Stay Updated**: Keep admin credentials secure
6. **Fair Moderation**: Be consistent with content policies

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Update payment phone number
- [ ] Enable HTTPS in production
- [ ] Regular database backups
- [ ] Monitor admin access logs
- [ ] Keep JWT secret secure
- [ ] Review user permissions regularly

---

## 📱 Mobile Admin Access

The admin panel is responsive and works on mobile devices:
- Access from phone/tablet
- Approve payments on the go
- Manage content anywhere
- Full functionality on mobile

---

## 🆘 Emergency Procedures

### If Admin Account Compromised
1. Immediately change password
2. Check recent admin actions
3. Review all pending payments
4. Contact technical support

### If Payment System Down
1. Pause new payment submissions
2. Notify users via announcement
3. Process pending payments first
4. Resume when system restored

### If Database Issues
1. Stop accepting new payments
2. Restore from latest backup
3. Verify data integrity
4. Resume operations carefully

---

## 📚 Additional Resources

- Main README: Setup and installation
- FEATURES.md: Complete feature list
- DEPLOYMENT.md: Production deployment guide

---

**Admin Panel Access:** http://localhost:3000/admin

**Support:** For technical issues, check server logs and database status.

---

**Built for secure and efficient platform management! 🚀**
