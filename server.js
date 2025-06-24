const express = require('express');
const path = require('path');
const WhatsAppBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize bot
const bot = new WhatsAppBot();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Uptime Robot endpoint - detailed status
app.get('/uptime', (req, res) => {
    const botStatus = bot.getStatus();
    res.status(botStatus.isReady ? 200 : 503).json({
        status: botStatus.isReady ? 'online' : 'offline',
        botReady: botStatus.isReady,
        timestamp: new Date().toISOString(),
        message: botStatus.isReady ? 'WhatsApp Bot is running and connected!' : 'WhatsApp Bot is starting or disconnected',
        uptime: process.uptime(),
        logs: botStatus.logs.length
    });
});

// Health check endpoint for Uptime Robot
app.get('/health', (req, res) => {
    const botStatus = bot.getStatus();
    if (botStatus.isReady) {
        res.status(200).send('✅ WhatsApp Bot is running and connected!');
    } else {
        res.status(503).send('❌ WhatsApp Bot is starting or disconnected');
    }
});

// Database stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const { db } = require('./server/db');
        const { users, groups, messages, botLogs } = require('./shared/schema');
        const { sql } = require('drizzle-orm');
        
        const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
        const [groupCount] = await db.select({ count: sql`count(*)` }).from(groups);
        const [messageCount] = await db.select({ count: sql`count(*)` }).from(messages);
        const [logCount] = await db.select({ count: sql`count(*)` }).from(botLogs);
        
        res.json({
            users: parseInt(userCount.count),
            groups: parseInt(groupCount.count),
            messages: parseInt(messageCount.count),
            logs: parseInt(logCount.count),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            users: 0,
            groups: 0,
            messages: 0,
            logs: 0,
            error: 'Database not available',
            lastUpdated: new Date().toISOString()
        });
    }
});

// API endpoint to get bot status
app.get('/api/status', (req, res) => {
    res.json(bot.getStatus());
});

// API endpoint to get QR code
app.get('/api/qr', (req, res) => {
    const status = bot.getStatus();
    if (status.qrCode) {
        res.json({ qrCode: status.qrCode });
    } else {
        res.json({ qrCode: null });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    await bot.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    await bot.destroy();
    process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Web interface running on http://0.0.0.0:${PORT}`);
    console.log('📱 Use the web interface to monitor bot status and scan QR code');
    
    // Initialize bot
    bot.initialize();
});
