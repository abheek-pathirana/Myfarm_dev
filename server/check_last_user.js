const db = require('./db');

async function checkLastUser() {
    try {
        await db.initDb();
        const pool = db.pool;

        console.log('--- LATEST USER ---');
        const [users] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC LIMIT 1');
        console.log('User:', JSON.stringify(users, null, 2));

        if (users.length > 0) {
            console.log('\n--- PROFILE FOR USER ---');
            const [profiles] = await pool.execute('SELECT * FROM profiles WHERE user_id = ?', [users[0].id]);
            console.log('Profile:', JSON.stringify(profiles, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLastUser();
