# How to Find Your Twilio Credentials

Follow these steps to get your Twilio Account SID, Auth Token, and Phone Number.

---

## Step 1: Create a Twilio Account

### 1.1 Sign Up
1. Go to **https://www.twilio.com/try-twilio**
2. Click **"Sign up for free"**
3. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password
4. Click **"Start your free trial"**

### 1.2 Verify Your Email
1. Check your email inbox
2. Click the verification link from Twilio
3. Return to Twilio website

### 1.3 Verify Your Phone Number
1. Twilio will ask you to verify your phone number
2. Enter your phone number (include country code)
3. Choose "Text you a code"
4. Enter the verification code you receive
5. Click "Submit"

---

## Step 2: Get Your Account SID and Auth Token

### 2.1 Go to Console Dashboard
After signing in, you'll be on the **Twilio Console Dashboard**:
- URL: **https://console.twilio.com/**

### 2.2 Find Your Credentials
On the main dashboard page, you'll see a section called **"Account Info"** on the right side:

```
┌─────────────────────────────────────┐
│         Account Info                │
├─────────────────────────────────────┤
│ ACCOUNT SID                         │
│ ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│ [Copy button]                       │
│                                     │
│ AUTH TOKEN                          │
│ ••••••••••••••••••••••••••••••••   │
│ [Show] [Copy button]                │
└─────────────────────────────────────┘
```

### 2.3 Copy Account SID
1. Find **"ACCOUNT SID"**
2. It starts with **"AC"** followed by 32 characters
3. Click the **copy icon** next to it
4. This is your `TWILIO_ACCOUNT_SID`

Example: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2.4 Copy Auth Token
1. Find **"AUTH TOKEN"**
2. Click **"Show"** to reveal it
3. Click the **copy icon** to copy it
4. This is your `TWILIO_AUTH_TOKEN`

**⚠️ Important:** Keep this secret! Never share it or commit it to Git.

---

## Step 3: Get a Phone Number

### 3.1 Navigate to Phone Numbers
1. On the left sidebar, click **"Phone Numbers"**
2. Click **"Manage"**
3. Click **"Buy a number"**

OR directly go to: **https://console.twilio.com/us1/develop/phone-numbers/manage/search**

### 3.2 Choose Your Country
1. In the "Country" dropdown, select your country
2. For example: **United States**

### 3.3 Search for a Number
1. Check **"SMS"** capability (required for OTP)
2. Optionally check **"Voice"** if you want voice calls
3. Click **"Search"**

### 3.4 Buy a Number
1. Browse the available numbers
2. Click **"Buy"** next to the number you want
3. Confirm the purchase (it's free with trial credit!)
4. The number will appear in your **Active Numbers** list

### 3.5 Copy Your Phone Number
1. Go to **Phone Numbers → Manage → Active numbers**
2. Click on your phone number
3. Copy the number (it will be in format: `+1234567890`)
4. This is your `TWILIO_PHONE_NUMBER`

---

## Step 4: Add to Your Project

### 4.1 Create .env.local File
In your project root directory (`/Users/alviongs/Documents/Projects/sjml/`), create or edit `.env.local`:

```bash
# In terminal, create the file:
touch .env.local

# Or edit existing file:
nano .env.local
```

### 4.2 Add Your Credentials
Paste these lines with YOUR actual values:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_32_character_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Replace with your actual values:**
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your Account SID
- `your_32_character_auth_token_here` → Your Auth Token
- `+1234567890` → Your Twilio phone number

### 4.3 Save the File
- If using `nano`: Press `Ctrl + X`, then `Y`, then `Enter`
- If using a text editor: Just save normally

---

## Step 5: Install Twilio Package

In your terminal, run:

```bash
npm install twilio
```

Wait for installation to complete.

---

## Step 6: Restart Your Server

Stop your current server (if running) and restart:

```bash
# Stop server: Press Ctrl + C

# Restart server:
npm run dev
```

---

## Step 7: Test It!

1. Open your website in browser
2. Go to the **"Get Our Brand Strategy Playbook"** section
3. Click **"Download Free"**
4. Enter your phone number with country code (e.g., `+1234567890`)
5. Click **"Send OTP"**
6. Check your phone - you should receive an SMS with a 6-digit code!
7. Enter the code and verify

---

## Quick Reference: Where to Find Everything

### Twilio Console Home
```
https://console.twilio.com/
```

### Account SID & Auth Token
```
https://console.twilio.com/
→ Look on the right side under "Account Info"
```

### Phone Numbers
```
https://console.twilio.com/us1/develop/phone-numbers/manage/active
```

### Buy New Number
```
https://console.twilio.com/us1/develop/phone-numbers/manage/search
```

---

## Example .env.local File

Here's what your complete file should look like:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567

# Other environment variables (if you have any)
# DATABASE_URL=...
# NEXT_PUBLIC_API_URL=...
```

---

## Troubleshooting

### ❌ "Account SID not found"
**Solution:** Make sure you copied the entire SID starting with "AC"

### ❌ "Auth Token invalid"
**Solutions:**
1. Click "Show" to reveal the token before copying
2. Make sure you copied the entire token (32 characters)
3. No spaces before or after the token

### ❌ "Phone number not found"
**Solutions:**
1. Make sure the number includes the `+` and country code
2. No spaces or dashes in the number
3. Format: `+15551234567` (not `(555) 123-4567`)

### ❌ "Cannot send to unverified number"
**Solutions:**
- **Trial Account:** Can only send to verified numbers
- **Option 1:** Verify your recipient phone in Console → Phone Numbers → Verified Caller IDs
- **Option 2:** Upgrade to a paid account (removes restrictions)

### ❌ Changes not working
**Solution:** Restart your development server after adding env variables

---

## Trial Account Limitations

### Free Credits
- New accounts get **$15 free credit**
- Enough for ~2000 SMS messages

### Restrictions
- Can only send SMS to **verified phone numbers**
- To verify a number:
  1. Go to Console → Phone Numbers → Verified Caller IDs
  2. Click "Add a new Caller ID"
  3. Enter phone number
  4. Verify with code

### Upgrade Benefits
- Send to any phone number
- No "Sent from your Twilio trial account" prefix
- Higher rate limits

---

## Security Checklist

✅ `.env.local` is in `.gitignore` (already done)  
✅ Never commit credentials to Git  
✅ Don't share Auth Token with anyone  
✅ Set spending limit in Twilio Console  
✅ Enable two-factor authentication on Twilio account  

---

## Need Help?

### Twilio Support
- Documentation: https://www.twilio.com/docs/sms
- Help Center: https://support.twilio.com/
- Community: https://www.twilio.com/community

### Quick Links
- Console: https://console.twilio.com/
- Billing: https://console.twilio.com/billing
- Phone Numbers: https://console.twilio.com/phone-numbers

---

## Next Steps

After setup:
1. ✅ Test OTP with your phone number
2. ✅ Verify other phone numbers if needed (trial accounts)
3. ✅ Set up billing alerts in Twilio Console
4. ✅ Monitor usage in Console dashboard

**You're all set! Your OTP system is now live!** 🎉
