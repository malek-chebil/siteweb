# 🔐 Anonymous Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the classifieds platform anonymously while maintaining security and functionality. This is crucial for sensitive applications where operator anonymity is a priority.

---

## 🎯 Objectives

1. **Protect Operator Identity**: Deploy and operate without revealing personal information
2. **Maintain Security**: Ensure all security measures are in place
3. **Ensure Functionality**: Maintain full platform functionality
4. **Comply with Best Practices**: Follow operational security (OPSEC) principles

---

## 📋 Prerequisites

1. **VPN/Proxy Service**: Reliable VPN or proxy service (preferably privacy-focused)
2. **Cryptocurrency Wallet**: For anonymous payments (Bitcoin, Monero)
3. **Anonymous Email**: Privacy-focused email service (ProtonMail, Tutanota)
4. **Pseudonym**: Consistent pseudonym for all operations
5. **Tor Browser**: For sensitive operations (optional but recommended)

---

## 🚀 Phase 1: Infrastructure Setup

### 1.1 Domain Registration

#### Option A: Anonymous Domain Registrar
- **Recommended Providers**:
  - **Njalla** (https://njal.la) - Accepts cryptocurrency, no KYC
  - **OrangeWebsite** (https://www.orangewebsite.com) - Privacy-focused
  - **1984 Hosting** (https://www.1984.hosting) - Privacy-focused

#### Steps:
1. **Connect via VPN** before accessing registrar
2. **Create account** using pseudonym
3. **Use anonymous email** (ProtonMail, Tutanota)
4. **Enable WHOIS privacy** protection
5. **Register domain** using cryptocurrency payment
6. **Use privacy-focused DNS** provider (Cloudflare with privacy settings)

#### Option B: Tor Hidden Service (.onion)
- **Considerations**:
  - Maximum anonymity
  - Requires Tor infrastructure
  - Limited accessibility (Tor browser only)
  - Slower performance

### 1.2 Hosting Provider

#### Recommended Providers:
- **1984 Hosting** (https://www.1984.hosting) - Privacy-focused, accepts cryptocurrency
- **Njalla** (https://njal.la) - VPS hosting, accepts cryptocurrency
- **OrangeWebsite** (https://www.orangewebsite.com) - Privacy-focused
- **Hostinger** (with cryptocurrency payment) - Budget-friendly

#### Steps:
1. **Connect via VPN** before accessing provider
2. **Create account** using pseudonym
3. **Use anonymous email** for account
4. **Choose VPS plan** suitable for your needs
5. **Pay with cryptocurrency** (Bitcoin, Monero)
6. **Use separate account** for each service
7. **Avoid linking accounts** to personal information

### 1.3 Database Hosting (Supabase)

#### Steps:
1. **Create Supabase account** using anonymous email
2. **Use pseudonym** for account name
3. **Pay with cryptocurrency** (if available) or prepaid card
4. **Enable SSL/TLS** for database connections
5. **Configure Row Level Security (RLS)** policies
6. **Use connection pooling** with SSL
7. **Enable database backups** (encrypted)

### 1.4 CDN & DDoS Protection

#### Recommended Providers:
- **Cloudflare** (https://www.cloudflare.com) - Free tier available, privacy settings
- **AWS CloudFront** (with anonymous account) - Enterprise-grade
- **Fastly** (with anonymous account) - High performance

#### Steps:
1. **Create Cloudflare account** using anonymous email
2. **Add domain** to Cloudflare
3. **Enable privacy settings**:
   - Proxy status: Proxied (orange cloud)
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Automatic HTTPS Rewrites: On
   - Minimum TLS Version: 1.2
   - Opportunistic Encryption: On
   - TLS 1.3: On
   - Automatic HTTPS Rewrites: On
4. **Configure firewall rules**:
   - Block known malicious IPs
   - Rate limiting rules
   - Geo-blocking (if needed)
5. **Enable DDoS protection**:
   - DDoS protection: On
   - Bot Fight Mode: On
   - Challenge Passage: Configured
6. **Configure WAF (Web Application Firewall)**:
   - Enable managed rules
   - Custom rules for your application
   - Rate limiting rules

---

## 🔧 Phase 2: Deployment Setup

### 2.1 Server Configuration

#### Steps:
1. **Connect to VPS** via SSH (using VPN)
2. **Update system**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **Configure firewall** (ufw):
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp  # SSH
   sudo ufw allow 80/tcp  # HTTP
   sudo ufw allow 443/tcp # HTTPS
   sudo ufw enable
   ```
4. **Configure SSH security**:
   - Change default SSH port
   - Disable password authentication
   - Use SSH key-based authentication
   - Disable root login
   - Configure fail2ban
5. **Install dependencies**:
   - Python 3.11+
   - PostgreSQL client
   - Nginx (reverse proxy)
   - Certbot (SSL certificates)
   - Docker (optional)

### 2.2 Application Deployment

#### Backend Deployment:
1. **Clone repository** (using anonymous Git hosting):
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   - Set `DEBUG=False`
   - Configure database connection
   - Configure Supabase credentials
   - Configure CORS origins
5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```
6. **Start application** (using systemd):
   ```bash
   sudo systemctl start your-app
   sudo systemctl enable your-app
   ```

#### Frontend Deployment:
1. **Build frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. **Deploy to CDN** (Cloudflare Pages, Vercel, Netlify):
   - Use anonymous accounts
   - Configure environment variables
   - Enable HTTPS
   - Configure custom domain

### 2.3 Nginx Configuration

#### Steps:
1. **Install Nginx**:
   ```bash
   sudo apt install nginx -y
   ```
2. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       # Security headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;

       # Proxy to backend
       location /api/ {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Serve frontend
       location / {
           root /var/www/your-app;
           try_files $uri $uri/ /index.html;
       }
   }
   ```
3. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```
4. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🔒 Phase 3: Security Configuration

### 3.1 Environment Variables

#### Backend (.env):
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# CORS
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# App
DEBUG=False
API_V1_PREFIX=/api/v1

# Security
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
MAX_REQUEST_SIZE=10485760
MAX_FILE_SIZE=5242880
MAX_FILES_PER_UPLOAD=10
```

#### Frontend (.env):
```env
VITE_API_URL=https://your-domain.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3.2 Database Security

#### Steps:
1. **Enable SSL/TLS** for database connections
2. **Use connection pooling** with SSL
3. **Implement Row Level Security (RLS)** in Supabase
4. **Configure database backups** (encrypted)
5. **Regular security updates**
6. **Monitor database access logs**

### 3.3 Application Security

#### Steps:
1. **Enable security middleware**:
   - Rate limiting
   - Security headers
   - Request size limits
   - Input sanitization
2. **Disable debug mode** in production
3. **Disable API documentation** in production
4. **Configure CORS** properly
5. **Enable HTTPS only**
6. **Implement security logging**
7. **Monitor security events**

---

## 🛡️ Phase 4: Operational Security (OPSEC)

### 4.1 Identity Protection

#### Best Practices:
1. **Never use real name** in any account
2. **Use consistent pseudonym** across all services
3. **Separate personal and project identities**
4. **Use different emails** for different services
5. **Avoid linking accounts** to personal information
6. **Use VPN** for all operations
7. **Use Tor** for sensitive operations
8. **Avoid sharing personal information** in communications

### 4.2 Communication Security

#### Best Practices:
1. **Use encrypted messaging** (Signal, ProtonMail)
2. **Use anonymous email** for all communications
3. **Avoid sharing personal information** in emails
4. **Use PGP encryption** for sensitive communications
5. **Use VPN** for all communications
6. **Avoid linking communications** to personal identity

### 4.3 Payment Security

#### Best Practices:
1. **Use cryptocurrency** for all payments (Bitcoin, Monero)
2. **Use prepaid cards** if cryptocurrency is not available
3. **Avoid credit cards** (traceable)
4. **Use separate wallets** for different services
5. **Avoid linking payments** to personal identity
6. **Use privacy-focused payment processors**

### 4.4 Monitoring & Logging

#### Best Practices:
1. **Use anonymous monitoring services**
2. **Avoid services requiring personal information**
3. **Use privacy-focused analytics**
4. **Minimize data collection**
5. **Anonymize logs** (remove IP addresses, personal information)
6. **Regular log cleanup**
7. **Encrypt logs at rest**

---

## 📊 Phase 5: Maintenance & Updates

### 5.1 Regular Maintenance

#### Tasks:
1. **Security updates** (weekly)
2. **Dependency updates** (monthly)
3. **Security audits** (quarterly)
4. **Backup verification** (monthly)
5. **Log review** (weekly)
6. **Monitoring review** (weekly)

### 5.2 Update Procedures

#### Steps:
1. **Test updates** in staging environment
2. **Backup before updates**
3. **Deploy updates via VPN**
4. **Use anonymous git repositories**
5. **Avoid linking updates** to personal identity
6. **Use encrypted communication channels**
7. **Regular security updates**

### 5.3 Incident Response

#### Procedures:
1. **Detect security incidents**
2. **Isolate affected systems**
3. **Investigate and contain threat**
4. **Remediate vulnerabilities**
5. **Update security measures**
6. **Post-incident review**
7. **Document lessons learned**

---

## 🚨 Phase 6: Threat Mitigation

### 6.1 Common Threats

#### Threats:
1. **DDoS attacks**
2. **Data breaches**
3. **Legal requests** (warrants, subpoenas)
4. **Hosting provider compliance**
5. **Domain registrar compliance**
6. **Identity exposure**

### 6.2 Mitigation Strategies

#### Strategies:
1. **DDoS protection** (Cloudflare, AWS Shield)
2. **Data encryption** (at rest and in transit)
3. **Minimal data collection**
4. **Privacy-focused providers**
5. **Legal jurisdiction considerations**
6. **Identity protection** (OPSEC)

---

## ✅ Checklist

### Pre-Deployment
- [ ] VPN/Proxy service configured
- [ ] Anonymous email account created
- [ ] Cryptocurrency wallet set up
- [ ] Domain registered anonymously
- [ ] Hosting provider selected
- [ ] Supabase account created
- [ ] CDN configured
- [ ] Server configured
- [ ] Application deployed
- [ ] SSL certificates installed
- [ ] Security middleware enabled
- [ ] Environment variables configured
- [ ] Database security configured
- [ ] Monitoring configured
- [ ] Backup strategy implemented

### Post-Deployment
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] File upload tested
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Logging verified
- [ ] Monitoring verified
- [ ] Backup tested
- [ ] Incident response tested
- [ ] Security audit completed

---

## 📚 Resources

### Privacy-Focused Services
- **Domain Registrars**: Njalla, OrangeWebsite, 1984 Hosting
- **Hosting Providers**: 1984 Hosting, Njalla, OrangeWebsite
- **Email Services**: ProtonMail, Tutanota
- **VPN Services**: Mullvad, ProtonVPN, ExpressVPN
- **CDN Services**: Cloudflare (with privacy settings)

### Cryptocurrency
- **Bitcoin**: For anonymous payments
- **Monero**: For maximum anonymity
- **Wallets**: Electrum, Exodus, Monero GUI

### Communication
- **Encrypted Messaging**: Signal, ProtonMail
- **Anonymous Email**: ProtonMail, Tutanota
- **PGP Encryption**: GnuPG

### Documentation
- **Operational Security**: OWASP OPSEC Guide
- **Privacy Best Practices**: Privacy Guides
- **Cryptocurrency**: Bitcoin.org, GetMonero.org

---

## 🎯 Conclusion

This guide provides a comprehensive framework for anonymous deployment while maintaining security and functionality. Follow these steps carefully, and always prioritize operational security (OPSEC) to protect your identity and the platform.

---

**Last Updated**: [Date]
**Version**: 1.0
**Status**: Draft

