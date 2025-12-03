# WhatsApp OTP Setup Guide

This guide will help you set up WhatsApp OTP verification for the playbook download feature using Twilio's WhatsApp API.

## Why WhatsApp OTP?

- ✅ Higher delivery rates than SMS
- ✅ No carrier fees in many countries
- ✅ Better user experience (most users have WhatsApp)
- ✅ Support for rich formatting (bold text, line breaks)
- ✅ Free for many markets
- ✅ Works with existing Twilio account

---

## Prerequisites

- Twilio account (same one used for SMS)
- WhatsApp Business Account (for production) OR Twilio Sandbox (for testing)

---

## Option 1: Quick Start with Twilio Sandbox (Testing)

### Perfect for: Development and testing before going live

### Step 1: Access Twilio Sandbox
1. Log into your [Twilio Console](https://console.twilio.com/)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. You'll see a sandbox number (e.g., `+1 415 523 8886`)

### Step 2: Join the Sandbox
1. From your personal WhatsApp, send the join code to the sandbox number
   - Example: Send `join <your-sandbox-code>` to `+1 415 523 8886`
2. You'll receive a confirmation message

### Step 3: Add Environment Variables
Add to your `.env.local` file:

```env
# Twilio Credentials (same as SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# WhatsApp Configuration
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Important Notes:**
- The WhatsApp number MUST include the `whatsapp:` prefix
- Use your actual sandbox number from Twilio Console
- Keep your Twilio credentials (from SMS setup)

### Step 4: Test
1. Restart your development server: `npm run dev`
2. Try the playbook download with your phone number
3. You should receive a WhatsApp message with the OTP!

### Sandbox Limitations
- Only verified WhatsApp numbers can receive messages
- To add more testers: They must join the sandbox first
- Sandbox sessions expire after 24 hours of inactivity
- Not suitable for production

---

## Option 2: Production Setup with WhatsApp Business API

### Perfect for: Live production environment

### Step 1: Get WhatsApp Business Account
1. Go to [Twilio Console → Messaging → Senders → WhatsApp senders](https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders)
2. Click **Create new WhatsApp sender**
3. Follow the setup wizard

### Step 2: Business Verification
1. Submit your business profile
2. Verify your business with Facebook (required)
3. Wait for approval (typically 1-3 business days)

### Step 3: Message Template Approval
WhatsApp requires pre-approved templates for business messages.

Create a template for OTP:
- Template name: `otp_verification`
- Category: **Authentication**
- Language: Your target language
- Template body:
  ```
  Hi {{1}},

  Your OTP for downloading the Brand Strategy Playbook is:

  *{{2}}*

  Valid for 5 minutes.

  Do not share this code with anyone.
  ```

Variables:
- `{{1}}` = User's name
- `{{2}}` = OTP code

### Step 4: Get Your WhatsApp Number
Once approved, you'll receive a WhatsApp-enabled number.

### Step 5: Update Environment Variables
```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# WhatsApp Configuration (Production)
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155551234
```

### Step 6: Update Code for Templates (Optional)
For production with approved templates, update `lib/sms/twilio-whatsapp.ts`:

```typescript
// Use template-based messaging for production
const message = await client.messages.create({
  from: fromWhatsAppNumber,
  to: toWhatsApp,
  contentSid: 'YOUR_TEMPLATE_SID',
  contentVariables: JSON.stringify({
    '1': name,
    '2': otp,
  }),
})
```

---

## Phone Number Format

WhatsApp requires E.164 format for phone numbers:

### ✅ Correct Format
- `+14155551234` (US)
- `+919876543210` (India)
- `+447911123456` (UK)
- `+6591234567` (Singapore)

### ❌ Incorrect Format
- `4155551234` (missing + and country code)
- `(415) 555-1234` (formatting)
- `+1 415 555 1234` (spaces)

The API automatically formats numbers, but users should input with country code.

---

## Cost Comparison

### WhatsApp vs SMS Pricing

| Region | WhatsApp (per message) | SMS (per message) | Savings |
|--------|------------------------|-------------------|---------|
| India | FREE | $0.0365 | 100% |
| Indonesia | FREE | $0.0550 | 100% |
| Mexico | FREE | $0.0042 | 100% |
| UK | $0.0107 | $0.0512 | 79% |
| US | $0.0050 | $0.0075 | 33% |

**Note:** WhatsApp pricing varies by country and message type. Check [Twilio's WhatsApp Pricing](https://www.twilio.com/whatsapp/pricing) for your region.

### Authentication Messages
- Often FREE or heavily discounted
- Our OTP use case qualifies as "Authentication"
- Confirm with Twilio for your specific region

---

## Fallback Strategy

The system automatically falls back to SMS if WhatsApp fails:

1. **First attempt:** WhatsApp (if configured)
2. **Second attempt:** Twilio SMS (if configured)
3. **Third attempt:** AWS SNS (if configured)
4. **Development mode:** Display OTP in browser

This ensures delivery even if WhatsApp is unavailable.

---

## Testing Your Setup

### 1. Verify Configuration
Create a test file `test-whatsapp-config.js`:

```javascript
console.log('WhatsApp configured:', !!(
  process.env.TWILIO_ACCOUNT_SID && 
  process.env.TWILIO_AUTH_TOKEN && 
  process.env.TWILIO_WHATSAPP_NUMBER
))

console.log('WhatsApp number:', process.env.TWILIO_WHATSAPP_NUMBER)
```

Run: `node test-whatsapp-config.js`

### 2. Test End-to-End Flow
1. Go to your website
2. Click "Download Free" on playbook section
3. Enter your phone number (with country code!)
4. Click "Send OTP"
5. Check your WhatsApp for the message
6. Enter the OTP
7. PDF should download

### 3. Check Server Logs
Look for these messages:
- ✅ `"WhatsApp OTP sent successfully: [message_sid]"`
- ❌ `"WhatsApp send failed"` (then fallback to SMS)

---

## Troubleshooting

### Issue: "WhatsApp send failed"

**Possible causes:**
1. Environment variables not set correctly
2. Server not restarted after adding env vars
3. Phone number not in sandbox (for testing)
4. WhatsApp number format incorrect

**Solutions:**
1. Double-check `.env.local` has all variables
2. Restart server: `npm run dev`
3. Join sandbox first (send join code)
4. Verify phone number has `+` and country code

### Issue: "The number is not a WhatsApp user"

**Solution:** 
- Ensure the recipient has WhatsApp installed
- Verify phone number is correct
- In sandbox: recipient must join first

### Issue: "Template not approved" (Production)

**Solution:**
1. Check template status in Twilio Console
2. Wait for approval (can take 1-3 days)
3. Use sandbox for testing while waiting

### Issue: "Sandbox session expired"

**Solution:**
- Re-join sandbox by sending join code again
- Sessions expire after 24 hours of inactivity

---

## Migration from SMS to WhatsApp

If you're already using SMS OTP:

### Step 1: Add WhatsApp alongside SMS
- Set up WhatsApp (sandbox or production)
- Keep existing SMS configuration
- System automatically prioritizes WhatsApp

### Step 2: Test with Both
- WhatsApp users receive via WhatsApp
- System falls back to SMS if WhatsApp fails
- No changes needed for users

### Step 3: Monitor Delivery
- Check Twilio logs for success rates
- Compare WhatsApp vs SMS delivery
- Monitor costs

### Step 4: Full Migration (Optional)
- Once confident, can disable SMS fallback
- Keep SMS as backup for reliability

---

## Security Best Practices

1. **Credentials Security**
   - Never commit `.env.local` to Git
   - Use environment variables in production
   - Keep Twilio credentials secret

2. **Rate Limiting**
   - Implement rate limiting per phone number
   - Prevent OTP spam/abuse
   - Consider CAPTCHA for high volume

3. **Template Security**
   - Use approved templates only (production)
   - Don't send sensitive data beyond OTP
   - Clear messaging about OTP validity

4. **Monitor Usage**
   - Set up Twilio usage alerts
   - Track failed deliveries
   - Monitor unusual patterns

5. **OTP Best Practices**
   - 6-digit codes (current implementation ✅)
   - 5-minute expiry (current implementation ✅)
   - Single use only (current implementation ✅)
   - Secure storage (consider Redis for production)

---

## Updating UI Messages

Update `components/playbook-download-modal.tsx` to reflect WhatsApp:

```typescript
// Line 152 - Update label
<label className="block text-sm font-medium text-gray-400 mb-2">
  Phone Number (WhatsApp) *
</label>

// Line 161 - Update helper text
<p className="text-xs text-gray-500 mt-1">
  Include country code (e.g., +1 for US). You'll receive OTP on WhatsApp.
</p>

// Line 186 - Update OTP sent message
<p className="text-xs text-gray-500 mt-1">
  OTP sent to your WhatsApp: {phone}{" "}
  <button ...>Change</button>
</p>
```

---

## Advanced Features (Future Enhancements)

### 1. Media Support
WhatsApp supports images and PDFs:
```typescript
await client.messages.create({
  from: fromWhatsAppNumber,
  to: toWhatsApp,
  body: "Your OTP: 123456",
  mediaUrl: ["https://example.com/logo.png"]
})
```

### 2. Interactive Messages
Use buttons for better UX:
- "Verify" button
- "Resend OTP" button
- "Cancel" button

### 3. Rich Formatting
Already implemented:
- Bold text: `*text*`
- Italic: `_text_`
- Strikethrough: `~text~`

### 4. Delivery Status
Track message status:
```typescript
const message = await client.messages(messageSid).fetch()
console.log(message.status) // delivered, read, etc.
```

---

## Support Resources

### Twilio WhatsApp Documentation
- [WhatsApp Overview](https://www.twilio.com/docs/whatsapp)
- [API Reference](https://www.twilio.com/docs/whatsapp/api)
- [Sandbox Guide](https://www.twilio.com/docs/whatsapp/sandbox)
- [Best Practices](https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates)

### Twilio Support
- Support Portal: https://support.twilio.com/
- Community Forum: https://www.twilio.com/community
- Status Page: https://status.twilio.com/

---

## Production Checklist

Before going live:

- [ ] WhatsApp Business Account approved
- [ ] Message template approved
- [ ] Phone number verified
- [ ] Environment variables set
- [ ] Rate limiting implemented
- [ ] Error monitoring setup
- [ ] Spending limits configured
- [ ] Tested with multiple phone numbers
- [ ] Fallback to SMS working
- [ ] UI updated to mention WhatsApp
- [ ] User privacy policy updated

---

## Next Steps

1. Start with Twilio Sandbox for testing
2. Test with your phone number
3. Add team members to sandbox
4. Apply for WhatsApp Business (for production)
5. Get templates approved
6. Deploy to production
7. Monitor delivery and costs
8. Gather user feedback

Your WhatsApp OTP system is ready! 🎉📱
