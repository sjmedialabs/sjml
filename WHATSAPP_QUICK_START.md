# WhatsApp OTP Quick Start (5 minutes)

## 🚀 Fastest Setup with Twilio Sandbox

### 1. Access Twilio Sandbox
- Go to [Twilio Console](https://console.twilio.com/)
- Navigate: **Messaging → Try it out → Send a WhatsApp message**
- Note your sandbox number (e.g., `+1 415 523 8886`)

### 2. Join Sandbox from Your Phone
Open WhatsApp and send:
```
join <your-sandbox-code>
```
to the sandbox number shown in console

### 3. Add Environment Variable
Add to `.env.local`:
```env
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Important:** 
- Keep your existing `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- The number MUST have `whatsapp:` prefix
- Use YOUR actual sandbox number from Twilio Console

### 4. Restart Server
```bash
npm run dev
```

### 5. Test It!
1. Go to playbook section
2. Click "Download Free"
3. Enter phone: `+1234567890` (your number)
4. Check WhatsApp for OTP! 📱

---

## ⚡ What Changed?

### Files Created:
- `lib/sms/twilio-whatsapp.ts` - WhatsApp service
- `WHATSAPP_OTP_SETUP.md` - Full documentation
- `WHATSAPP_QUICK_START.md` - This guide

### Files Modified:
- `app/api/playbook/verify-otp/route.ts` - Uses WhatsApp first, SMS fallback
- `components/playbook-download-modal.tsx` - UI mentions WhatsApp

### Priority Order:
1. ✅ WhatsApp (if configured)
2. SMS via Twilio (fallback)
3. SMS via AWS SNS (fallback)
4. Development mode (display OTP)

---

## 📝 Environment Variables

### Minimum for WhatsApp:
```env
TWILIO_ACCOUNT_SID=ACxxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Keep SMS as Fallback (Optional):
```env
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 💰 Why WhatsApp?

| Feature | WhatsApp | SMS |
|---------|----------|-----|
| Cost (India) | FREE | $0.0365 |
| Cost (US) | $0.0050 | $0.0075 |
| Delivery Rate | 95%+ | 85%+ |
| User Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Rich Formatting | ✅ | ❌ |

---

## ⚠️ Sandbox Limitations

- Only verified numbers can receive messages
- Each tester must join sandbox first
- Session expires after 24 hours inactivity
- Not for production use

**For Production:** See `WHATSAPP_OTP_SETUP.md` for WhatsApp Business setup

---

## 🔍 Troubleshooting

### Not receiving WhatsApp?
1. ✅ Did you join sandbox? (send join code)
2. ✅ Is phone number correct? (with + and country code)
3. ✅ Did you restart server?
4. ✅ Check server logs for errors

### "WhatsApp send failed"
- Falls back to SMS automatically
- Check if `TWILIO_WHATSAPP_NUMBER` is set correctly
- Verify sandbox is active in Twilio Console

---

## 📚 Full Documentation

See `WHATSAPP_OTP_SETUP.md` for:
- Production setup with WhatsApp Business
- Template approval process
- Advanced features
- Cost comparison
- Security best practices

---

## ✅ You're Done!

Your system now uses WhatsApp for OTP with SMS fallback. Test it and enjoy better delivery rates! 🎉
