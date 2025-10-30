import twilio from 'twilio';

class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Default to Twilio sandbox

    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
      this.enabled = true;
    } else {
      console.warn('WhatsApp/Twilio credentials not configured. WhatsApp notifications will be disabled.');
      this.enabled = false;
    }
  }

  /**
   * Format phone number to international format
   * Handles Morocco numbers (default) and international numbers with country codes
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;

    // Remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/[\s\-()]/g, '');

    // If already starts with +, it's already international format
    if (cleaned.startsWith('+')) {
      return `whatsapp:${cleaned}`;
    }

    // If starts with 00 (international dialing prefix), convert to +
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2);
      return `whatsapp:${cleaned}`;
    }

    // If starts with 0, check if it's followed by a country code or local number
    if (cleaned.startsWith('0')) {
      // Remove the leading 0
      const withoutZero = cleaned.substring(1);

      // Common country codes that might appear after 0
      const countryCodePatterns = [
        { code: '212', length: 9 },  // Morocco: 0212XXXXXXXXX
        { code: '962', length: 9 },  // Jordan: 0962XXXXXXXXX
        { code: '971', length: 9 },  // UAE: 0971XXXXXXXXX
        { code: '966', length: 9 },  // Saudi: 0966XXXXXXXXX
        { code: '33', length: 9 },   // France: 033XXXXXXXXX
        { code: '1', length: 10 },   // USA/Canada: 01XXXXXXXXXX
      ];

      // Check if number starts with a known country code
      for (const pattern of countryCodePatterns) {
        if (withoutZero.startsWith(pattern.code)) {
          // It's an international number with 0 prefix
          return `whatsapp:+${withoutZero}`;
        }
      }

      // If no country code detected, assume it's a local Morocco number
      // Morocco local format: 06XXXXXXXX or 07XXXXXXXX
      cleaned = '212' + withoutZero;
      return `whatsapp:+${cleaned}`;
    }

    // If doesn't start with + or 0, check if it already has a country code
    // Common country codes: 212, 962, 971, 966, 33, 1, etc.
    const commonCountryCodes = ['212', '962', '971', '966', '20', '213', '216', '218', '33', '44', '1'];

    for (const code of commonCountryCodes) {
      if (cleaned.startsWith(code)) {
        // Number already has country code, just add +
        return `whatsapp:+${cleaned}`;
      }
    }

    // Default: assume it needs + prefix
    return `whatsapp:+${cleaned}`;
  }

  /**
   * Send a basic text message
   */
  async sendMessage(to, message) {
    if (!this.enabled) {
      console.log('[WhatsApp] Service disabled. Would have sent:', { to, message });
      return { success: false, reason: 'Service disabled' };
    }

    try {
      const formattedNumber = this.formatPhoneNumber(to);

      if (!formattedNumber) {
        throw new Error('Invalid phone number');
      }

      const result = await this.client.messages.create({
        from: this.whatsappNumber,
        to: formattedNumber,
        body: message
      });

      console.log(`[WhatsApp] Message sent successfully to ${to}. SID: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('[WhatsApp] Failed to send message:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send media message (image, document, etc.)
   */
  async sendMedia(to, message, mediaUrl) {
    if (!this.enabled) {
      console.log('[WhatsApp] Service disabled. Would have sent media:', { to, message, mediaUrl });
      return { success: false, reason: 'Service disabled' };
    }

    try {
      const formattedNumber = this.formatPhoneNumber(to);

      if (!formattedNumber) {
        throw new Error('Invalid phone number');
      }

      const result = await this.client.messages.create({
        from: this.whatsappNumber,
        to: formattedNumber,
        body: message,
        mediaUrl: [mediaUrl]
      });

      console.log(`[WhatsApp] Media message sent successfully to ${to}. SID: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('[WhatsApp] Failed to send media message:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notification: New submission received
   */
  async notifyNewSubmission(submission) {
    const message = `مرحباً ${submission.name}! 👋

شكراً لتقديم طلبك في خدمة: ${submission.service}

تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا قريباً.
سنتواصل معك خلال 24 ساعة.

يمكنك تتبع حالة طلبك من خلال:
${process.env.FRONTEND_URL || 'http://localhost:8083'}/track

Connect Job World 🌍`;

    return await this.sendMessage(submission.phone, message);
  }

  /**
   * Notification: Status update
   */
  async notifyStatusUpdate(submission, newStatus, customMessage = '') {
    const statusMessages = {
      'pending_validation': 'طلبك قيد المراجعة',
      'validated': 'تم التحقق من طلبك بنجاح ✅',
      'call_confirmed': 'تم تأكيد موعد الاتصال 📞',
      'documents_requested': 'يرجى إرفاق المستندات المطلوبة 📄',
      'documents_uploaded': 'تم استلام المستندات',
      'documents_verified': 'تم التحقق من المستندات بنجاح ✅',
      'converted_to_client': 'مبروك! تم قبول طلبك 🎉'
    };

    const statusText = statusMessages[newStatus] || 'تم تحديث حالة طلبك';

    const message = `${submission.name} العزيز،

${statusText}

${customMessage ? customMessage + '\n\n' : ''}تتبع طلبك:
${process.env.FRONTEND_URL || 'http://localhost:8083'}/track

للاستفسار: اتصل بنا
Connect Job World 🌍`;

    return await this.sendMessage(submission.phone, message);
  }

  /**
   * Notification: Document request
   */
  async notifyDocumentRequest(submission, documentTypes) {
    const docList = documentTypes.map(doc => `  • ${doc}`).join('\n');

    const message = `${submission.name} العزيز،

يرجى تحميل المستندات التالية لاستكمال طلبك:

${docList}

يمكنك تحميل المستندات من خلال:
${process.env.FRONTEND_URL || 'http://localhost:8083'}/track

أو التواصل معنا للمساعدة.

Connect Job World 🌍`;

    return await this.sendMessage(submission.phone, message);
  }

  /**
   * Notification: Document verified
   */
  async notifyDocumentVerified(submission, documentName) {
    const message = `${submission.name} العزيز،

تم التحقق من المستند: ${documentName} ✅

نحن نواصل معالجة طلبك. سنتواصل معك قريباً.

تتبع طلبك:
${process.env.FRONTEND_URL || 'http://localhost:8083'}/track

Connect Job World 🌍`;

    return await this.sendMessage(submission.phone, message);
  }

  /**
   * Notification: Appointment reminder
   */
  async notifyAppointment(submission, appointmentDate, appointmentTime, notes = '') {
    const message = `${submission.name} العزيز،

تذكير: لديك موعد معنا 📅

التاريخ: ${appointmentDate}
الوقت: ${appointmentTime}

${notes ? notes + '\n\n' : ''}يرجى الحضور في الموعد المحدد أو التواصل معنا في حال وجود أي تعديل.

Connect Job World 🌍`;

    return await this.sendMessage(submission.phone, message);
  }

  /**
   * Notification: Welcome message (converted to client)
   */
  async notifyWelcomeClient(client) {
    const message = `مبروك ${client.name}! 🎉

تم قبول طلبك بنجاح وأصبحت الآن عميل لدى Connect Job World.

سنبدأ العمل على ملفك فوراً لضمان نجاح رحلتك في الهجرة.

فريقنا سيتواصل معك قريباً للخطوات القادمة.

مرحباً بك في عائلة Connect Job World! 🌍✨`;

    return await this.sendMessage(client.phone, message);
  }
}

// Export singleton instance
export default new WhatsAppService();
