const db = require('./db');

async function addColumns() {
    try {
        await db.initDb();
        const pool = db.pool;
        // In MySQL, we check if columns exist or use a safer approach.
        // For simplicity, we can use a try-catch for each.

        const queries = [
            "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday VARCHAR(50)",
            "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20)",
            "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_source VARCHAR(100)"
        ];

        // Note: IF NOT EXISTS for ADD COLUMN is supported in MariaDB and newer MySQL versions.
        // If it fails, we fall back to manual check or handle error.

        for (const query of queries) {
            try {
                await pool.execute(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${query.split(' ')[5]}`);
                } else {
                    console.error(`Error executing ${query}:`, err.message);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error("Critical error in add_columns:", err);
        process.exit(1);
    }
}

addColumns();
