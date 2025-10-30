# WhatsApp Integration Setup Guide

This guide will help you set up WhatsApp notifications for your Connect Job World platform using Twilio.

## Overview

The platform now supports WhatsApp notifications for:
- ✅ New submission confirmations
- ✅ Status updates (validated, call confirmed, etc.)
- ✅ Document upload requests
- ✅ Document verification confirmations
- ✅ Welcome messages for new clients

## Step 1: Create a Twilio Account

1. Go to [Twilio Sign Up](https://www.twilio.com/try-twilio)
2. Fill in your details:
   - First Name, Last Name
   - Email address
   - Password
3. Verify your email address
4. Complete phone verification
5. Answer a few questions about your use case

**Note**: You'll get **free trial credits** ($15) to test the integration!

## Step 2: Get Your Twilio Credentials

1. After logging in, you'll see the **Twilio Console Dashboard**
2. Find your credentials in the dashboard:
   - **Account SID**: Looks like `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click "View" to reveal it
3. Copy both values - you'll need them later

## Step 3: Set Up WhatsApp Sandbox (For Testing)

Twilio provides a WhatsApp sandbox for testing without needing business approval.

1. In Twilio Console, go to: **Messaging** → **Try it out** → **Send a WhatsApp message**
   - Or visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. You'll see a **sandbox number**: `+1 (415) 523-8886`

3. **Join the sandbox**:
   - Open WhatsApp on your phone
   - Send a message to `+1 (415) 523-8886`
   - Send this exact message: `join <your-sandbox-code>`
   - Example: `join define-setting`
   - You should receive a confirmation message

4. The sandbox number is: `whatsapp:+14155238886`

## Step 4: Configure Your Application

1. Open the `.env` file in the `server` directory:
   ```bash
   cd "/Users/z.tejjani/Desktop/Connect Job World/server"
   nano .env
   ```

2. Add your Twilio credentials:
   ```env
   # Twilio WhatsApp Configuration
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

3. Also update the FRONTEND_URL if needed:
   ```env
   FRONTEND_URL=http://localhost:8083
   ```

4. Save the file (`Ctrl+X`, then `Y`, then `Enter`)

5. Restart your server:
   ```bash
   # The server will automatically restart if using nodemon
   # Or manually stop and start: npm run dev
   ```

## Step 5: Test the Integration

### Test 1: New Submission

1. Go to your website: http://localhost:8083
2. Fill out the contact form with:
   - Your name
   - Email
   - **Phone number** (format: `07xxxxxxxx` for Jordan, or with country code)
   - Select a service
   - Message
3. Submit the form
4. **Check your WhatsApp** - you should receive a confirmation message!

### Test 2: Status Updates

1. Log into the admin dashboard: http://localhost:8083/admin
2. Go to "الطلبات المقدمة" (Submissions)
3. Click on a submission
4. Click "تحقق من البيانات" (Validate Data)
5. **Check WhatsApp** - the client should receive a status update!

### Test 3: Document Request

1. In admin, go to submission details
2. Go to "المستندات" (Documents) tab
3. Click "طلب مستندات" (Request Documents)
4. Generate the upload link
5. **Check WhatsApp** - the client should receive the upload link!

## Important Notes

### Phone Number Format

The system automatically formats phone numbers:
- Morocco numbers starting with `0` are converted to `+212`
- Other formats are preserved
- Examples:
  - Input: `0612345678` → Output: `+212612345678`
  - Input: `0712345678` → Output: `+212712345678`
  - Input: `+212612345678` → Output: `+212612345678`

### Sandbox Limitations

- **Tested numbers only**: Only phone numbers that joined the sandbox can receive messages
- **Twilio branding**: Messages include "Sent from your Twilio trial account"
- **Limited to 500 messages** during trial

### Production Setup

For production use:

1. **Upgrade your Twilio account** (add payment method)
2. **Request WhatsApp Business API access**:
   - Go to: https://console.twilio.com/us1/develop/sms/whatsapp/senders
   - Click "Request Access"
   - Complete the business profile
   - Wait for approval (can take 1-2 weeks)
3. **Get your own WhatsApp number**
4. **Update .env** with your production number

## Troubleshooting

### "WhatsApp/Twilio credentials not configured"

This warning appears in the server console when credentials are missing. The system will continue to work, but WhatsApp notifications won't be sent.

**Solution**: Add your credentials to `.env` file

### "Failed to send message"

Common causes:
1. Phone number hasn't joined the sandbox
2. Invalid phone number format
3. Twilio trial account limits reached
4. Wrong Account SID or Auth Token

**Solution**: Check server logs for detailed error messages

### Messages not received

1. Verify phone number joined sandbox (send `join <code>` again)
2. Check phone number format in database
3. Verify Twilio credentials are correct
4. Check Twilio console logs: https://console.twilio.com/us1/monitor/logs/sms

## Notification Types Reference

### 1. New Submission Confirmation
**Trigger**: When a user submits the contact form
**Message includes**:
- Personalized greeting
- Service name
- Confirmation of receipt
- Tracking link

### 2. Status Update: Validated
**Trigger**: Admin validates submission data
**Message includes**:
- Status confirmation
- Next steps

### 3. Status Update: Call Confirmed
**Trigger**: Admin confirms call with client
**Message includes**:
- Call confirmation
- Any notes from admin
- Tracking link

### 4. Document Request
**Trigger**: Admin generates document upload link
**Message includes**:
- Upload link
- Link expiry (default: 7 days)
- Upload limit
- Admin notes

### 5. Document Verified
**Trigger**: Admin verifies a single document
**Message includes**:
- Document name
- Verification confirmation
- Progress update

### 6. All Documents Verified
**Trigger**: All required documents are verified
**Message includes**:
- Completion confirmation
- Next steps notification

### 7. Welcome New Client
**Trigger**: Submission converted to client
**Message includes**:
- Congratulations message
- Welcome to the platform
- Next steps information

## Cost Estimation

### Twilio Pricing (as of 2024)

**Trial Account**:
- Free $15 credit
- ~500 messages
- Perfect for testing

**Production**:
- WhatsApp conversations: $0.005 - $0.05 per conversation
- Monthly costs for 1000 clients: ~$50-100/month
- No setup fees

**Conversation Definition**: A 24-hour window after the first message

## Support

### Twilio Support
- Documentation: https://www.twilio.com/docs/whatsapp
- Support: https://support.twilio.com/
- Community: https://www.twilio.com/community

### Platform Support
- Server logs: Check `server` directory console output
- Enable WhatsApp: Make sure credentials are in `.env`
- Test mode: System works normally even if WhatsApp is disabled

## Next Steps

After successful testing, consider:

1. **Apply for WhatsApp Business API** for production use
2. **Set up message templates** for better formatting
3. **Add two-way messaging** (handle replies from clients)
4. **Integrate with other services** (email, SMS)
5. **Add appointment scheduling** via WhatsApp

---

**Questions?** Check the server console logs or Twilio dashboard for detailed information.
