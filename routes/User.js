const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendMail = require("../middlewares/sendMail");
const crypto = require("crypto");

function generateCode(length = 6) {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

dotenv.config();

// Kayıt (register) endpoint'i
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta ile kullanıcı zaten var" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyMailCode = generateCode();
    const verifyMailCodeExpire = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    const user = new User({
        name,
        email,
        password: hashedPassword,
        verifyMailCode,
        verifyMailCodeExpire
    });
    await user.save();

    // Doğrulama kodu gönder
    await sendMail(email, "E-posta Doğrulama Kodu", `Doğrulama kodunuz: ${verifyMailCode}`);

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu. Lütfen e-posta adresinize gelen kod ile hesabınızı doğrulayın." });
});

// Giriş (login) endpoint'i
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Alan kontrolü
    if (!email || !password) {
        return res.status(400).json({ message: "E-posta ve şifre zorunludur" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Geçersiz şifre" });
    }

    // JWT token oluştur (örnek: 1 saat geçerli)
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 60 * 1000 // 1 saat
    });

    // Kullanıcıya token ve temel bilgiler dön
    res.status(200).json({
        message: "Giriş başarılı",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

// E-posta doğrulama kodu kontrol endpoint'i
router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    if (user.verifyMailCode === code && user.verifyMailCodeExpire > Date.now()) {
        user.isVerifiedMail = true;
        user.verifyMailCode = undefined;
        user.verifyMailCodeExpire = undefined;
        await user.save();
        return res.json({ message: "E-posta başarıyla doğrulandı" });
    } else {
        return res.status(400).json({ message: "Geçersiz veya süresi dolmuş kod" });
    }
});

// Doğrulama kodunu tekrar gönderen endpoint
router.post('/resend-verify-code', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    if (user.isVerifiedMail) return res.status(400).json({ message: "E-posta zaten doğrulanmış" });

    // Yeni kod üret
    const verifyMailCode = generateCode();
    const verifyMailCodeExpire = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    user.verifyMailCode = verifyMailCode;
    user.verifyMailCodeExpire = verifyMailCodeExpire;
    await user.save();

    await sendMail(email, "E-posta Doğrulama Kodu", `Doğrulama kodunuz: ${verifyMailCode}`);
    res.json({ message: "Doğrulama kodu tekrar gönderildi" });
});

module.exports = router;