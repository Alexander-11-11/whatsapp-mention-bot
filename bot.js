const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

class WhatsAppBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: './session'
            }),
            puppeteer: {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            }
        });
        this.isReady = false;
        this.qrCode = null;
        this.statusLog = [];
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            this.qrCode = qr;
            qrcode.generate(qr, { small: true });
            const message = 'QR Code generated! Scan with your WhatsApp mobile app';
            console.log('📱 ' + message);
            this.addToLog('info', message);
        });

        this.client.on('ready', () => {
            this.isReady = true;
            this.qrCode = null;
            const message = 'WhatsApp Bot is ready and connected!';
            console.log('✅ ' + message);
            this.addToLog('success', message);
        });

        this.client.on('authenticated', () => {
            const message = 'Authentication successful!';
            console.log('🔐 ' + message);
            this.addToLog('success', message);
        });

        this.client.on('auth_failure', (msg) => {
            const message = `Authentication failed: ${msg}`;
            console.log('❌ ' + message);
            this.addToLog('error', message);
        });

        this.client.on('disconnected', (reason) => {
            this.isReady = false;
            const message = `Bot disconnected: ${reason}`;
            console.log('📴 ' + message);
            this.addToLog('warning', message);
        });

        this.client.on('message', async (msg) => {
            try {
                await this.handleMessage(msg);
            } catch (error) {
                console.error('❌ Error handling message:', error);
                this.addToLog('error', `Error handling message: ${error.message}`);
            }
        });
    }

    async handleMessage(msg) {
        const messageInfo = `Message from ${msg.from}: ${msg.body}`;
        console.log('📩 ' + messageInfo);

        // Command: !منشن_جماعي
        if (msg.body.toLowerCase() === '!منشن_جماعي') {
            const chat = await msg.getChat();
            if (!chat.isGroup) {
                await msg.reply('❌ هذا الأمر مخصص للمجموعات فقط!');
                return;
            }

            const admins = chat.participants.filter(p => p.isAdmin || p.isSuperAdmin);
            const members = chat.participants.filter(p => !p.isAdmin && !p.isSuperAdmin);

            let text = `*◕◕════🌟 منشن جماعي🌟════◕◕*\n\n`;
            text += `*${chat.name}*\n\n`;

            text += `*|👑الأدمنز:*\n\n`;
            admins.forEach((admin, index) => {
                text += `*${index + 1}|👑*@${admin.id.user}\n`;
            });

            text += `\n*▂▃▅▇█▓▒░  الاعضاء  ░▒▓█▇▅▃▂*\n\n`;
            members.forEach((member, index) => {
                text += `*${index + 1}|* 👤@${member.id.user}\n`;
            });
            text += `\n*◕◕════🌟 منشن جماعي🌟════◕◕*\n\n`;
            text += `*꧁࿇⸙ مـع تـحـ🖋️ـيـات ادارة⤦ ${chat.name} ࿇꧂*`;

            const mentions = [...admins, ...members].map(p => p.id._serialized);
            await chat.sendMessage(text, { mentions });
            this.addToLog('success', `Successfully mentioned ${mentions.length} participants in ${chat.name}`);
        }
        // Command: !help or !مساعدة
        else if (msg.body.toLowerCase() === '!help' || msg.body.toLowerCase() === '!مساعدة') {
            const helpText = `🤖 *WhatsApp Mention Bot*

📋 *Available Commands:*
• \`!منشن_جماعي\` - Mention all group members
• \`!help\` - Show this help message

📝 *Notes:*
• Commands only work in group chats
• Bot requires admin permissions for best functionality

🌐 *Languages:*
• English & Arabic supported

Made with ❤️ using whatsapp-web.js`;

            await msg.reply(helpText);
            this.addToLog('info', 'Help command executed');
        }
    }

    addToLog(type, message) {
        const timestamp = new Date().toISOString();
        this.statusLog.unshift({
            timestamp,
            type,
            message
        });
        if (this.statusLog.length > 100) {
            this.statusLog = this.statusLog.slice(0, 100);
        }
    }

    getStatus() {
        return {
            isReady: this.isReady,
            qrCode: this.qrCode,
            logs: this.statusLog
        };
    }

    async initialize() {
        try {
            console.log('🚀 Initializing WhatsApp Bot...');
            this.addToLog('info', 'Bot initialization started');
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Failed to initialize bot:', error);
            this.addToLog('error', `Failed to initialize: ${error.message}`);
        }
    }

    async destroy() {
        try {
            console.log('🛑 Shutting down WhatsApp Bot...');
            this.addToLog('info', 'Bot shutdown initiated');
            await this.client.destroy();
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
            this.addToLog('error', `Shutdown error: ${error.message}`);
        }
    }
}

module.exports = WhatsAppBot;
