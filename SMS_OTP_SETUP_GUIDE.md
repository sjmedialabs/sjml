# SMS OTP Setup Guide

This guide will help you set up real SMS OTP verification for the playbook download feature.

## Choose Your SMS Provider

You can use either **Twilio** (recommended) or **AWS SNS**. Both are already integrated and the system will automatically use whichever one is configured.

---

## Option 1: Twilio Setup (Recommended)

### Why Twilio?
- Most popular and reliable
- Simple setup
- Great documentation
- Pay-as-you-go pricing (~$0.0075 per SMS)
- Free trial credit ($15)

### Step 1: Create Twilio Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get Your Credentials
1. Go to your [Twilio Console](https://console.twilio.com/)
2. Copy these values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)

### Step 3: Get a Phone Number
1. In Twilio Console, go to **Phone Numbers → Manage → Buy a number**
2. Choose your country
3. Select a number with SMS capability
4. Purchase the number (free with trial credit)

### Step 4: Install Twilio Package
```bash
npm install twilio
```

### Step 5: Add Environment Variables
Add these to your `.env` or `.env.local` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Important Notes:**
- Use your actual Twilio Account SID and Auth Token
- Phone number must include country code (e.g., +1 for US)
- Keep these credentials secret - never commit to Git

### Step 6: Test
1. Restart your development server: `npm run dev`
2. Try the playbook download with a real phone number
3. You should receive an actual SMS with the OTP!

### Trial Account Limitations
- You can only send SMS to verified phone numbers
- To verify a number: Twilio Console → Phone Numbers → Verified Caller IDs
- Upgrade to remove this restriction

---

## Option 2: AWS SNS Setup

### Why AWS SNS?
- Good if you're already using AWS
- Integrated with AWS ecosystem
- Very cheap (~$0.00645 per SMS in US)

### Step 1: AWS Account Setup
1. Create an AWS account at [https://aws.amazon.com](https://aws.amazon.com)
2. Go to IAM Console
3. Create a new user with programmatic access
4. Attach policy: `AmazonSNSFullAccess`
5. Save the Access Key ID and Secret Access Key

### Step 2: Enable SMS in SNS
1. Go to AWS SNS Console
2. Select your region (e.g., us-east-1)
3. Go to **Text messaging (SMS)** → **SMS preferences**
4. Set spending limit and other preferences

### Step 3: Request Production Access (Optional)
- By default, AWS SNS is in "Sandbox" mode
- Go to SNS → **Text messaging (SMS)** → Request production access
- Fill out the form explaining your use case

### Step 4: Install AWS SDK
```bash
npm install @aws-sdk/client-sns
```

### Step 5: Add Environment Variables
Add these to your `.env` or `.env.local` file:

```env
# AWS SNS Configuration
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
```

### Step 6: Test
1. Restart your development server: `npm run dev`
2. Try the playbook download
3. You should receive an SMS!

---

## Phone Number Format

All phone numbers must include the country code:
- ✅ Good: `+14155551234` (US)
- ✅ Good: `+919876543210` (India)
- ✅ Good: `+447911123456` (UK)
- ❌ Bad: `4155551234` (missing country code)
- ❌ Bad: `(415) 555-1234` (US formatting)

The API validates phone numbers automatically.

---

## Cost Estimates

### Twilio Pricing (US)
- SMS: $0.0075 per message
- 1000 OTPs = $7.50
- 10,000 OTPs = $75

### AWS SNS Pricing (US)
- SMS: $0.00645 per message
- 1000 OTPs = $6.45
- 10,000 OTPs = $64.50

Prices vary by country. Check provider websites for exact rates.

---

## Development vs Production

### Development Mode
- If NO SMS service is configured, the system falls back to development mode
- OTP is displayed in the browser modal
- OTP is also logged to server console
- No actual SMS is sent

### Production Mode
- When Twilio or AWS SNS is configured, real SMS is sent
- OTP is NOT displayed in browser
- User receives OTP via SMS
- More secure

---

## Testing Your Setup

### 1. Check Environment Variables
Create a test file `test-sms-config.js`:

```javascript
// For Twilio
console.log('Twilio configured:', !!(
  process.env.TWILIO_ACCOUNT_SID && 
  process.env.TWILIO_AUTH_TOKEN && 
  process.env.TWILIO_PHONE_NUMBER
))

// For AWS SNS
console.log('AWS SNS configured:', !!(
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY
))
```

Run: `node test-sms-config.js`

### 2. Test OTP Flow
1. Go to your website
2. Click "Download Free" on playbook section
3. Enter your phone number (with country code!)
4. Click "Send OTP"
5. Check your phone for SMS
6. Enter the OTP
7. PDF should download

### 3. Check Server Logs
Look for these messages in your server console:
- ✅ "OTP sent successfully: [message_id]"
- ❌ "Twilio send failed" or "AWS SNS send failed"

---

## Troubleshooting

### "OTP not sent" Error
**Problem:** SMS service not configured properly

**Solutions:**
1. Check environment variables are set correctly
2. Restart your server after adding env vars
3. Verify credentials in provider console
4. Check phone number format (must include +country code)

### Twilio: "The number is unverified"
**Problem:** Trial account can only send to verified numbers

**Solutions:**
1. Verify your phone number in Twilio Console
2. Upgrade to a paid account (remove trial restrictions)

### AWS SNS: "InvalidParameterException"
**Problem:** Phone number format or SNS not enabled in region

**Solutions:**
1. Check phone number has country code
2. Verify SNS is enabled in your AWS region
3. Check spending limit in SNS settings

### "Development Mode" Warning
**Problem:** No SMS service configured

**Solution:** Set up Twilio or AWS SNS environment variables

---

## Security Best Practices

1. **Never commit credentials to Git**
   - Use `.env.local` (already in `.gitignore`)
   - Use environment variables in production

2. **Rotate credentials regularly**
   - Change Twilio Auth Token every 90 days
   - Rotate AWS keys every 90 days

3. **Set spending limits**
   - Twilio: Set monthly spending cap
   - AWS: Set SNS spending quota

4. **Monitor usage**
   - Check your provider dashboard regularly
   - Set up alerts for unusual activity

5. **Rate limiting** (Future enhancement)
   - Limit OTP requests per phone number
   - Implement CAPTCHA for high-volume

---

## Support

### Twilio Support
- Documentation: https://www.twilio.com/docs
- Support: https://support.twilio.com/

### AWS SNS Support
- Documentation: https://docs.aws.amazon.com/sns/
- Support: AWS Support Console

---

## Next Steps

After setup:
1. Test with real phone numbers
2. Monitor SMS delivery success rate
3. Set up error alerting
4. Consider adding rate limiting
5. Implement retry logic for failed SMS

Your OTP system is now ready for production! 🎉
