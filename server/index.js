const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    console.log('Signup Attempt:', req.body.email);
    const {
        email,
        password,
        fullName,
        address,
        gpsLocation,
        phoneNumber,
        birthday,
        gender,
        referralSource
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = randomUUID();

        console.log('Creating user:', userId);
        await db.pool.execute(
            'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
            [userId, email, hashedPassword]
        );

        // Create profile
        const profileId = randomUUID();
        const referralId = 'REF-' + require('crypto').randomBytes(4).toString('hex').toUpperCase();

        const profileParams = [
            profileId,
            userId,
            fullName || email.split('@')[0],
            address || null,
            gpsLocation || null,
            phoneNumber || null,
            birthday || null,
            gender || null,
            referralSource || null,
            referralId
        ].map(val => val === undefined ? null : val);

        console.log('Profile Params:', JSON.stringify(profileParams, null, 2));

        await db.pool.execute(
            `INSERT INTO profiles (
                id, user_id, full_name, address, gps_location, 
                phone_number, birthday, gender, referral_source, referral_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            profileParams
        );

        const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            user: { id: userId, email },
            session: { access_token: token, user: { id: userId, email } }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            user: { id: user.id, email: user.email },
            session: { access_token: token, user: { id: user.id, email: user.email } }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.pool.execute('SELECT id, email FROM users WHERE id = ?', [req.user.id]);
        const user = rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile Routes
app.get('/api/profiles/:userId', authenticateToken, async (req, res) => {
    if (req.params.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const [rows] = await db.pool.execute(`
            SELECT p.*, u.created_at 
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
        `, [req.params.userId]);

        const profile = rows[0];
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/profiles/:userId', authenticateToken, async (req, res) => {
    if (req.params.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const {
        full_name,
        address,
        gps_location,
        phone_number,
        birthday,
        gender,
        referral_source,
        fullName,
        gpsLocation,
        phoneNumber,
        referralSource
    } = req.body;

    const params = [
        full_name || fullName || null,
        address || null,
        gps_location || gpsLocation || null,
        phone_number || phoneNumber || null,
        birthday || null,
        gender || null,
        referral_source || referralSource || null,
        req.params.userId
    ].map(val => val === undefined ? null : val);

    try {
        await db.pool.execute(
            `UPDATE profiles 
         SET full_name = COALESCE(?, full_name), 
             address = COALESCE(?, address), 
             gps_location = COALESCE(?, gps_location),
             phone_number = COALESCE(?, phone_number),
             birthday = COALESCE(?, birthday),
             gender = COALESCE(?, gender),
             referral_source = COALESCE(?, referral_source)
         WHERE user_id = ?`,
            params
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { product_id, quantity, total_price } = req.body;
    const orderId = randomUUID();

    try {
        await db.pool.execute(
            'INSERT INTO orders (id, user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?, ?)',
            [orderId, req.user.id, product_id, quantity, Number(total_price)]
        );
        res.json({ message: 'Order created successfully', orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/orders/:orderId', authenticateToken, async (req, res) => {
    const { orderId } = req.params;

    try {
        const [rows] = await db.pool.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user.id]);
        const order = rows[0];

        if (!order) return res.status(404).json({ error: 'Order not found' });

        const orderDate = new Date(order.created_at);
        const now = new Date();
        const diffMs = now - orderDate;

        if (diffMs > 60000) {
            return res.status(400).json({ error: 'Order cannot be cancelled after 1 minute' });
        }

        await db.pool.execute('DELETE FROM orders WHERE id = ?', [orderId]);
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Routes
app.get('/api/admin/profiles', authenticateToken, async (req, res) => {
    const query = `
        SELECT profiles.*, users.email, users.created_at as joined_at
        FROM profiles 
        JOIN users ON profiles.user_id = users.id 
        ORDER BY users.created_at DESC
    `;
    try {
        const [rows] = await db.pool.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server after DB initialization
async function startServer() {
    try {
        await db.initDb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server due to database error.');
    }
}

startServer();
