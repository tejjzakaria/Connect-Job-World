# 🔒 Security Guidelines

## Overview
This document outlines the security measures implemented in the Connect Job World application and best practices for maintaining security in production.

---

## Security Features Implemented

### 1. Authentication & Authorization
- **JWT-based authentication** with HttpOnly cookies
- **Role-based access control** (Admin, Agent roles)
- **Password hashing** using bcrypt (10 rounds)
- **Token expiration** with configurable TTL
- **Refresh token rotation** (recommended to implement)

### 2. API Security
- **Rate Limiting**:
  - General API: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
- **Helmet.js**: Security headers (HSTS, CSP, etc.)
- **CORS**: Whitelist-based origin validation
- **Request size limits**: 10MB max
- **NoSQL Injection Protection**: Input sanitization
- **HTTP Parameter Pollution Protection**

### 3. Data Security
- **Input Validation**: Server-side validation for all inputs
- **Data Sanitization**: MongoDB injection prevention
- **Sensitive Data**: Never logged or exposed in errors
- **Database**: Connection string encryption, SSL/TLS connections

### 4. File Upload Security
- **File type validation**: Allowed types whitelist
- **File size limits**: 10MB maximum
- **Secure file storage**: Outside web root
- **Random file naming**: Prevents path traversal
- **MIME type verification**

---

## Security Best Practices

### Environment Variables
```bash
# Never commit these files
.env
.env.production

# Use strong secrets (32+ characters)
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### Database Security
- ✅ Use MongoDB Atlas with IP whitelist
- ✅ Enable authentication on self-hosted MongoDB
- ✅ Use SSL/TLS for database connections
- ✅ Implement regular backups
- ✅ Use least-privilege database users
- ✅ Rotate database credentials periodically

### Server Security
```bash
# Keep system updated
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Install fail2ban for brute-force protection
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### SSL/TLS Configuration
- Use Let's Encrypt for free SSL certificates
- Enable HSTS with 1-year max-age
- Use TLS 1.2 or higher only
- Disable weak ciphers
- Implement certificate pinning (optional)

### Application Security
```javascript
// Always validate user input
const validateInput = (data) => {
  // Sanitize and validate
  return sanitized;
};

// Never trust client-side data
app.post('/api/endpoint', (req, res) => {
  // Always validate on server
  if (!isValid(req.body)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
});

// Use parameterized queries (Mongoose does this by default)
User.find({ email: req.body.email }); // ✅ Safe
// Never: User.find(`{ email: '${req.body.email}' }`); // ❌ Vulnerable
```

---

## Vulnerability Prevention

### SQL/NoSQL Injection
```javascript
// ✅ Good - Parameterized query
const user = await User.findOne({ email: userEmail });

// ❌ Bad - String concatenation
const user = await User.findOne({ $where: `this.email == '${userEmail}'` });

// Use express-mongo-sanitize middleware
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

### XSS (Cross-Site Scripting)
```javascript
// Frontend: React escapes by default
<div>{userInput}</div> // ✅ Safe

// Be careful with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌ Dangerous

// Sanitize HTML if needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### CSRF (Cross-Site Request Forgery)
- Using JWT in Authorization header (not cookies) mitigates CSRF
- For cookie-based auth, implement CSRF tokens
- SameSite cookie attribute

### Path Traversal
```javascript
// ✅ Good - Validate and sanitize
const safeFilename = path.basename(req.body.filename);
const filepath = path.join(UPLOAD_DIR, safeFilename);

// ❌ Bad - Direct concatenation
const filepath = UPLOAD_DIR + req.body.filename; // Can be: ../../etc/passwd
```

---

## Monitoring & Incident Response

### Logging
```javascript
// Log security events
const securityLog = {
  timestamp: new Date(),
  event: 'login_failed',
  ip: req.ip,
  userAgent: req.get('user-agent'),
  attemptedUser: req.body.email,
};

// Never log sensitive data
// ❌ Bad
console.log({ password: user.password });

// ✅ Good
console.log({ userId: user._id, action: 'login' });
```

### Alerting
Set up alerts for:
- Multiple failed login attempts
- Unusual API usage patterns
- Database connection failures
- SSL certificate expiration
- High error rates

### Audit Trail
Implemented in `ActivityLog` model:
- User actions logged with timestamps
- IP address tracking
- User agent logging
- Action types categorized

---

## Compliance & Data Protection

### GDPR Considerations
- User data deletion capability
- Data export functionality
- Privacy policy requirements
- Consent management

### Data Retention
```javascript
// Implement data cleanup
const cleanupOldData = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await ActivityLog.deleteMany({
    createdAt: { $lt: sixMonthsAgo }
  });
};
```

---

## Regular Security Tasks

### Weekly
- [ ] Review application logs for anomalies
- [ ] Check failed login attempts
- [ ] Monitor API rate limits hits

### Monthly
- [ ] Update dependencies: `npm audit fix`
- [ ] Review user permissions and access
- [ ] Check SSL certificate expiry
- [ ] Review and rotate API keys

### Quarterly
- [ ] Penetration testing
- [ ] Security audit
- [ ] Review and update security policies
- [ ] Rotate JWT secrets (requires careful coordination)

---

## Security Incident Response

### 1. Detection
- Monitor logs and alerts
- User reports
- Automated scanning

### 2. Containment
```bash
# Immediate actions
pm2 stop connect-job-world-api  # Stop the application
sudo ufw deny from <suspicious-ip>  # Block IP
```

### 3. Investigation
- Review logs: `pm2 logs --lines 1000`
- Check database for unauthorized changes
- Identify attack vector

### 4. Recovery
- Patch vulnerability
- Restore from backup if needed
- Reset credentials if compromised

### 5. Post-Incident
- Document incident
- Update security measures
- Notify affected users (if required by law)

---

## Security Contacts

**Report Security Issues:**
- Email: security@your-domain.com
- PGP Key: [Link to public key]

**Do NOT publicly disclose security vulnerabilities**

---

## Security Checklist

### Application
- [✅] Input validation on all endpoints
- [✅] Authentication implemented
- [✅] Authorization checks on all protected routes
- [✅] Rate limiting configured
- [✅] CORS properly configured
- [✅] Security headers (Helmet)
- [✅] NoSQL injection protection
- [✅] File upload restrictions
- [ ] CSRF protection (if using cookies)
- [ ] Content Security Policy configured

### Infrastructure
- [ ] HTTPS/SSL enabled
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Fail2Ban installed
- [ ] Regular backups configured
- [ ] Monitoring and alerting setup

### Operational
- [ ] Dependencies up to date
- [ ] Security patches applied
- [ ] Secrets rotated regularly
- [ ] Access logs reviewed
- [ ] Incident response plan documented

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated**: 2025-01-30
