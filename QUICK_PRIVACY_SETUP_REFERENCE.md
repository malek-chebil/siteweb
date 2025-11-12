# 🚀 Quick Privacy Setup Reference

## Quick Start Checklist

### Phase 1: Preparation (30 minutes)

- [ ] **Set up VPN**: Mullvad VPN or ProtonVPN
- [ ] **Create anonymous email**: ProtonMail account
- [ ] **Set up Monero wallet**: Cake Wallet (for domain)
- [ ] **Set up Bitcoin wallet**: Electrum (for hosting)
- [ ] **Choose pseudonym**: Use consistently across all services

### Phase 2: Domain Registration (15 minutes)

- [ ] **Connect via VPN + Tor Browser**
- [ ] **Go to**: https://njal.la
- [ ] **Create account**: Use ProtonMail, pseudonym
- [ ] **Search domain**: Choose your domain name
- [ ] **Register domain**: Pay with Monero
- [ ] **Enable WHOIS privacy**: Free, included
- [ ] **Enable domain lock**: Prevents unauthorized transfers

### Phase 3: Hosting Setup (20 minutes)

- [ ] **Connect via VPN + Tor Browser**
- [ ] **Go to**: https://www.1984.hosting
- [ ] **Create account**: Use ProtonMail, pseudonym
- [ ] **Choose VPS plan**: Standard VPS (2 CPU, 2GB RAM, 40GB SSD)
- [ ] **Configure VPS**: Ubuntu 22.04, Iceland location
- [ ] **Generate SSH keys**: On your local machine
- [ ] **Order VPS**: Pay with Bitcoin
- [ ] **Wait for provisioning**: 5-15 minutes
- [ ] **Save VPS IP**: You'll need it for SSH access

### Phase 4: Server Security (30 minutes)

- [ ] **Connect to VPS**: `ssh root@YOUR_VPS_IP`
- [ ] **Update system**: `apt update && apt upgrade -y`
- [ ] **Create non-root user**: `adduser yourusername`
- [ ] **Configure SSH**: Disable root login, use SSH keys only
- [ ] **Configure firewall**: `ufw allow 2222/tcp, 80/tcp, 443/tcp`
- [ ] **Configure Fail2Ban**: Protect against brute force attacks
- [ ] **Enable auto-updates**: Keep system secure

### Phase 5: Database Setup (20 minutes)

- [ ] **Install PostgreSQL**: `apt install postgresql postgresql-contrib`
- [ ] **Create database user**: `createuser --interactive yourdbuser`
- [ ] **Create database**: `createdb -O yourdbuser yourdbname`
- [ ] **Enable SSL/TLS**: Generate SSL certificate
- [ ] **Configure PostgreSQL**: SSL enabled, localhost only
- [ ] **Test connection**: `psql -U yourdbuser -d yourdbname`

### Phase 6: Application Deployment (45 minutes)

- [ ] **Install dependencies**: Python, Node.js, Nginx
- [ ] **Clone repository**: Upload application files
- [ ] **Set up backend**: Create virtual environment, install dependencies
- [ ] **Configure .env**: Database URL, Supabase keys, CORS origins
- [ ] **Run migrations**: `alembic upgrade head`
- [ ] **Set up frontend**: Install dependencies, build application
- [ ] **Configure systemd**: Create service for backend
- [ ] **Configure Nginx**: Reverse proxy, SSL/TLS
- [ ] **Obtain SSL certificate**: `certbot --nginx -d yourdomain.com`

### Phase 7: CDN Setup (30 minutes)

- [ ] **Create Cloudflare account**: Use ProtonMail, pseudonym
- [ ] **Add domain**: `yourdomain.com`
- [ ] **Configure DNS**: Point to VPS IP, set proxy status to "Proxied"
- [ ] **Update nameservers**: In Njalla dashboard
- [ ] **Wait for DNS propagation**: 5-30 minutes
- [ ] **Configure SSL/TLS**: Full (strict) mode
- [ ] **Enable DDoS protection**: Should be enabled by default
- [ ] **Configure firewall rules**: Block malicious IPs, rate limiting
- [ ] **Configure WAF**: Enable managed rules

### Phase 8: Final Configuration (15 minutes)

- [ ] **Update CORS origins**: `https://yourdomain.com`
- [ ] **Verify security settings**: DEBUG=False, rate limiting enabled
- [ ] **Test application**: Registration, login, listing creation
- [ ] **Test security**: Rate limiting, security headers, SSL certificate
- [ ] **Configure backups**: Daily backup script
- [ ] **Set up monitoring**: Security logging, application logging

### Phase 9: Verification (15 minutes)

- [ ] **Test domain**: `https://yourdomain.com`
- [ ] **Test SSL**: Check SSL certificate validity
- [ ] **Test WHOIS privacy**: Verify WHOIS information is hidden
- [ ] **Test DNS**: Verify DNS points to Cloudflare
- [ ] **Test application**: All features working correctly
- [ ] **Test security**: Rate limiting, input sanitization, file uploads

### Phase 10: Operational Security (Ongoing)

- [ ] **Always use VPN**: For all server operations
- [ ] **Use SSH keys**: Never use passwords
- [ ] **Monitor logs**: Check security logs regularly
- [ ] **Update regularly**: System packages, application dependencies
- [ ] **Backup regularly**: Daily backups, test restoration
- [ ] **Use encrypted communication**: Signal, ProtonMail, PGP

---

## 🔐 Quick Command Reference

### Server Access
```bash
# Connect to VPS
ssh -i ~/.ssh/1984_hosting_key -p 2222 yourusername@YOUR_VPS_IP

# Check system status
sudo systemctl status yourclassifieds-backend
sudo systemctl status nginx
sudo systemctl status postgresql
```

### Application Management
```bash
# Restart backend
sudo systemctl restart yourclassifieds-backend

# Restart Nginx
sudo systemctl restart nginx

# Check logs
tail -f /var/www/yourclassifieds/backend/logs/security.log
tail -f /var/www/yourclassifieds/backend/logs/app.log
```

### Database Management
```bash
# Connect to database
psql -U yourdbuser -d yourdbname -h localhost

# Backup database
pg_dump -U yourdbuser -d yourdbname > backup.sql

# Restore database
psql -U yourdbuser -d yourdbname < backup.sql
```

### Security Checks
```bash
# Check firewall status
sudo ufw status verbose

# Check Fail2Ban status
sudo fail2ban-client status sshd

# Check SSL certificate
sudo certbot certificates

# Test SSL renewal
sudo certbot renew --dry-run
```

---

## 📊 Provider Quick Reference

### Domain Registration (Njalla)
- **Website**: https://njal.la
- **Payment**: Monero (XMR) or Bitcoin (BTC)
- **Cost**: $15-30/year
- **WHOIS Privacy**: Free, included
- **Support**: Email support, privacy-focused

### Hosting (1984 Hosting)
- **Website**: https://www.1984.hosting
- **Payment**: Bitcoin (BTC) or Credit Card
- **Cost**: $5-50/month (VPS)
- **Location**: Iceland (privacy-friendly)
- **Support**: Email support, privacy-focused

### CDN (Cloudflare)
- **Website**: https://www.cloudflare.com
- **Payment**: Credit Card (free tier available)
- **Cost**: Free (basic), $20/month (Pro)
- **Features**: DDoS protection, SSL/TLS, WAF
- **Support**: Email support, documentation

---

## 🚨 Emergency Contacts

### Security Issues
- **Review**: Security logs in `/var/www/yourclassifieds/backend/logs/security.log`
- **Check**: Application logs in `/var/www/yourclassifieds/backend/logs/app.log`
- **Monitor**: Cloudflare dashboard for DDoS attacks
- **Respond**: Follow incident response procedures

### Technical Issues
- **Check**: Application status: `sudo systemctl status yourclassifieds-backend`
- **Check**: Nginx status: `sudo systemctl status nginx`
- **Check**: Database status: `sudo systemctl status postgresql`
- **Review**: Error logs for specific issues

### Privacy Issues
- **Review**: WHOIS privacy settings in Njalla dashboard
- **Review**: Cloudflare privacy settings
- **Review**: Server security configuration
- **Update**: Privacy policies and settings

---

## ✅ Daily Checklist

### Morning
- [ ] Check security logs for overnight activity
- [ ] Check application logs for errors
- [ ] Verify application is running correctly
- [ ] Check backup status

### Evening
- [ ] Review security events
- [ ] Check for system updates
- [ ] Verify backups completed successfully
- [ ] Monitor for suspicious activity

### Weekly
- [ ] Update system packages
- [ ] Review security configuration
- [ ] Test backup restoration
- [ ] Check SSL certificate expiration

### Monthly
- [ ] Review security logs comprehensively
- [ ] Update application dependencies
- [ ] Review privacy settings
- [ ] Test security features
- [ ] Update documentation

---

## 🎯 Success Criteria

Your setup is complete when:

- [x] Domain registered anonymously (Njalla, Monero payment)
- [x] Hosting set up anonymously (1984 Hosting, Bitcoin payment)
- [x] Server secured (firewall, SSH keys, Fail2Ban)
- [x] Database secured (SSL/TLS, strong passwords)
- [x] Application deployed (backend, frontend, Nginx)
- [x] CDN configured (Cloudflare, SSL/TLS, DDoS protection)
- [x] Security features enabled (rate limiting, input sanitization, security headers)
- [x] WHOIS privacy enabled (domain information hidden)
- [x] SSL certificate valid (HTTPS, green lock icon)
- [x] Application tested (all features working)
- [x] Backups configured (daily backups, tested)
- [x] Monitoring enabled (security logging, application logging)

---

## 📚 Documentation

### Main Guides
- **MAXIMUM_PRIVACY_SETUP_GUIDE.md**: Complete step-by-step guide
- **PRIVACY_HOSTING_RECOMMENDATIONS.md**: Provider recommendations
- **ANONYMOUS_DEPLOYMENT_GUIDE.md**: General anonymous deployment guide
- **SECURITY_PLAN.md**: Comprehensive security plan

### Quick References
- **QUICK_PRIVACY_SETUP_REFERENCE.md**: This document
- **QUICK_SECURITY_CHECKLIST.md**: Security checklist
- **SECURITY_IMPLEMENTATION_SUMMARY.md**: Security implementation summary

---

## 🎉 You're All Set!

Your classifieds platform is now set up with **maximum privacy and anonymity**. Remember to:

1. **Always use VPN** for server operations
2. **Monitor security logs** regularly
3. **Update systems** regularly
4. **Backup regularly** and test restoration
5. **Stay anonymous** and follow OPSEC best practices

**Stay secure, stay private, stay anonymous!**

---

**Last Updated**: [Date]
**Version**: 1.0
**Status**: Complete

