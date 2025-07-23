// Nodemailer ile e-posta göndermek için yardımcı fonksiyon
const nodemailer = require('nodemailer');

/**
 * E-posta gönderir. Ortam değişkenleri eksikse veya gönderim başarısız olursa anlamlı hata verir.
 * @param {string} to - Alıcı e-posta adresi
 * @param {string} subject - E-posta konusu
 * @param {string} text - E-posta içeriği
 */
async function sendMail(to, subject, text) {
    // Ortam değişkenlerini kontrol et
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('E-posta göndermek için EMAIL_USER ve EMAIL_PASS ortam değişkenlerini .env dosyanıza ekleyin.');
    }

    // SMTP ayarlarını .env'den alma desteği (isteğe bağlı)
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST, // SMTP hostu (isteğe bağlı)
        port: process.env.EMAIL_PORT, // SMTP portu (isteğe bağlı)
        secure: process.env.EMAIL_SECURE === 'true', // true ise 465, false ise 587 (isteğe bağlı)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new Error('E-posta gönderilemedi: ' + err.message);
    }
}

module.exports = sendMail; 