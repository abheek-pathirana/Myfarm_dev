const db = require('./db');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');

const email = 'abheek.pathirana@gmail.com';
const password = 'password123'; // Temporary password

async function createAdmin() {
    try {
        await db.initDb();
        const pool = db.pool;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = randomUUID();
        const profileId = randomUUID();
        const referralId = 'REF-' + require('crypto').randomBytes(4).toString('hex').toUpperCase();

        // First delete if exists
        await pool.execute("DELETE FROM users WHERE email = ?", [email]);
        console.log("Cleaned up existing user");

        // Insert new user
        await pool.execute(
            'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
            [userId, email, hashedPassword]
        );
        console.log("Created user record");

        // Create profile
        await pool.execute(
            'INSERT INTO profiles (id, user_id, full_name, referral_id) VALUES (?, ?, ?, ?)',
            [profileId, userId, 'Admin User', referralId]
        );
        console.log("Created profile record");

        process.exit(0);
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
}

createAdmin();
