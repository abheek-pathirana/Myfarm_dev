const db = require('./db');

const emails = ['abheek.pathirana@gmail.com', 'abheek.pathirana@springfield.lk'];

async function resetAdmins() {
    try {
        await db.initDb();
        const pool = db.pool;
        for (const email of emails) {
            const [result] = await pool.execute("DELETE FROM users WHERE email = ?", [email]);
            console.log(`Deleted user ${email} (Affected rows: ${result.affectedRows})`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error deleting users:', err);
        process.exit(1);
    }
}

resetAdmins();
