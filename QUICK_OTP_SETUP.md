# Quick OTP Setup Reference

## 🚀 Fastest Setup: Twilio (5 minutes)

### 1. Install Package
```bash
npm install twilio
```

### 2. Get Credentials
- Sign up at https://www.twilio.com/try-twilio
- Get Account SID & Auth Token from console
- Buy a phone number (free with trial credit)

### 3. Add to .env.local
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test
- Go to playbook section
- Click "Download Free"
- Enter your phone with country code: `+1234567890`
- Check your phone for SMS!

---

## 📋 Environment Variables Checklist

### For Twilio:
```env
TWILIO_ACCOUNT_SID=ACxxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
TWILIO_PHONE_NUMBER=+1234567890
```

### For AWS SNS:
```env
AWS_ACCESS_KEY_ID=AKIAxxxxx...
AWS_SECRET_ACCESS_KEY=xxxxx...
AWS_REGION=us-east-1
```

---

## ⚠️ Common Issues

### ❌ "OTP not sent"
→ Environment variables not set or server not restarted

### ❌ "Unverified number" (Twilio)
→ Verify phone in Twilio Console or upgrade account

### ❌ "Invalid phone number"
→ Must include country code: `+1234567890`

---

## 💰 Cost
- Twilio: ~$0.0075 per SMS
- AWS SNS: ~$0.00645 per SMS
- 1000 OTPs ≈ $7

---

## 🔒 Security
- Never commit `.env` files to Git
- Keep credentials secret
- Set spending limits in provider dashboard

---

## 📚 Full Documentation
See `SMS_OTP_SETUP_GUIDE.md` for complete setup instructions
