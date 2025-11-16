# 🚀 Anonymous Deployment - Starting Guide

## 📋 Overview

We'll deploy your classifieds platform completely anonymously. This means:
- ✅ No real name or personal information exposed
- ✅ Payments with cryptocurrency (Monero/Bitcoin)
- ✅ Privacy-focused providers (Njalla, 1984 Hosting, Cloudflare)
- ✅ WHOIS privacy enabled
- ✅ VPN for all operations
- ✅ Encrypted communications

---

## 🎯 Step-by-Step Plan

### **PHASE 1: Preparation (30-60 minutes)** ⚠️ **START HERE**

#### 1.1 Set Up VPN (5 minutes)
- [ ] **Choose VPN**: Mullvad VPN (https://mullvad.net) or ProtonVPN (https://protonvpn.com)
- [ ] **Purchase VPN**: $5-10/month, pay with cryptocurrency if possible
- [ ] **Download and Install**: VPN client
- [ ] **Connect**: Always connect to VPN before doing anything else

#### 1.2 Create Anonymous Email (10 minutes)
- [ ] **Go to**: https://proton.me (connect via VPN first!)
- [ ] **Create account**: Use pseudonym (NOT your real name)
- [ ] **Don't provide**: Phone number or recovery email
- [ ] **Enable 2FA**: Use authenticator app
- [ ] **Save credentials**: Securely (password manager)

#### 1.3 Set Up Cryptocurrency Wallets (20 minutes)

**Monero Wallet** (for domain):
- [ ] **Download Cake Wallet**: App Store or Google Play
- [ ] **Create wallet**: Write down seed phrase (25 words) - KEEP SECRET!
- [ ] **Send Monero**: Get some Monero (buy from exchange, send to wallet)

**Bitcoin Wallet** (for hosting):
- [ ] **Download Electrum**: https://electrum.org
- [ ] **Create wallet**: Write down seed phrase (12 words) - KEEP SECRET!
- [ ] **Send Bitcoin**: Get some Bitcoin (buy from exchange, send to wallet)

#### 1.4 Choose Pseudonym (5 minutes)
- [ ] **Pick name**: Example "Alex Smith" (use consistently everywhere)
- [ ] **Pick email**: Use your ProtonMail address
- [ ] **Remember**: NEVER use your real name anywhere!

---

### **PHASE 2: Domain Registration (15-30 minutes)**

#### 2.1 Register Domain with Njalla
- [ ] **Connect VPN + Tor Browser** (optional but recommended)
- [ ] **Go to**: https://njal.la
- [ ] **Create account**: Use ProtonMail, pseudonym
- [ ] **Search domain**: Choose your domain name (e.g., `yourclassifieds.com`)
- [ ] **Configure settings**:
  - ✅ Enable WHOIS privacy (free)
  - ✅ Enable domain lock
  - ⚠️ Choose 1-3 years registration
- [ ] **Pay with Monero**: Copy payment address, send from wallet
- [ ] **Wait**: 10-20 minutes for payment confirmation
- [ ] **Verify**: Domain is registered and active

**Cost**: $15-30/year (depends on TLD)

---

### **PHASE 3: Hosting Setup (20-40 minutes)**

#### 3.1 Register with 1984 Hosting
- [ ] **Connect VPN + Tor Browser**
- [ ] **Go to**: https://www.1984.hosting
- [ ] **Create account**: Use ProtonMail, pseudonym
- [ ] **Choose VPS Plan**:
  - **Basic**: $5-10/month (1 CPU, 1GB RAM) - Minimum
  - **Standard**: $10-20/month (2 CPU, 2GB RAM) - **Recommended**
  - **Advanced**: $20-50/month (4 CPU, 4GB RAM) - Better performance
- [ ] **Configure VPS**:
  - OS: Ubuntu 22.04 LTS
  - Location: Iceland (privacy-friendly)
  - Hostname: Your domain name
- [ ] **Generate SSH keys** (on your local machine):
  ```bash
  ssh-keygen -t ed25519 -C "yourpseudonym@protonmail.com"
  # Save as: ~/.ssh/1984_hosting_key
  # Set strong passphrase
  ```
- [ ] **Copy public key** to 1984 Hosting dashboard
- [ ] **Order VPS**: Pay with Bitcoin
- [ ] **Wait**: 5-15 minutes for provisioning
- [ ] **Save**: VPS IP address (you'll need it!)

**Cost**: $10-20/month (Standard plan)

---

### **PHASE 4: Server Security (30-45 minutes)**

This will be done after VPS is provisioned. We'll:
- [ ] Update system
- [ ] Create non-root user
- [ ] Secure SSH (disable root login, use keys only, change port)
- [ ] Configure firewall (UFW)
- [ ] Set up Fail2Ban
- [ ] Enable automatic security updates

**Detailed commands in**: `MAXIMUM_PRIVACY_SETUP_GUIDE.md` Step 4

---

### **PHASE 5: Database Setup (20 minutes)**

We'll install PostgreSQL on the VPS:
- [ ] Install PostgreSQL
- [ ] Create database user and database
- [ ] Enable SSL/TLS
- [ ] Configure security

**OR**: Keep using Supabase (if you prefer managed database)

---

### **PHASE 6: Application Deployment (45-60 minutes)**

- [ ] Install dependencies (Python, Node.js, Nginx)
- [ ] Upload application files
- [ ] Set up backend (venv, install dependencies, configure .env)
- [ ] Set up frontend (install, build)
- [ ] Configure systemd service (backend)
- [ ] Configure Nginx (reverse proxy, SSL/TLS)
- [ ] Obtain SSL certificate (Let's Encrypt)

---

### **PHASE 7: CDN Setup (30 minutes)**

- [ ] Create Cloudflare account (ProtonMail, pseudonym)
- [ ] Add domain to Cloudflare
- [ ] Configure DNS records (point to VPS IP)
- [ ] Update nameservers (in Njalla dashboard)
- [ ] Configure SSL/TLS (Full strict)
- [ ] Enable DDoS protection
- [ ] Configure firewall rules

---

## 🔥 **IMMEDIATE ACTION PLAN**

### Right Now - Start Here:

1. **Connect to VPN** ✅
   - Download Mullvad VPN or ProtonVPN
   - Connect before doing anything else

2. **Create ProtonMail Account** ✅
   - Go to: https://proton.me (via VPN!)
   - Create account with pseudonym
   - Enable 2FA

3. **Set Up Cryptocurrency Wallets** ✅
   - Download Cake Wallet (Monero)
   - Download Electrum (Bitcoin)
   - Get some cryptocurrency ready

4. **Register Domain** ✅
   - Go to: https://njal.la (via VPN + Tor)
   - Register domain with Monero payment
   - Enable WHOIS privacy

5. **Get Hosting** ✅
   - Go to: https://www.1984.hosting (via VPN + Tor)
   - Register with Bitcoin payment
   - Provision VPS

---

## 📊 Cost Estimate

| Item | Cost | Payment Method |
|------|------|----------------|
| VPN | $5-10/month | Credit Card or Crypto |
| Anonymous Email | Free (ProtonMail) | - |
| Domain | $15-30/year | Monero |
| Hosting (VPS) | $10-20/month | Bitcoin |
| Cloudflare CDN | Free (basic) | Credit Card |
| **Total** | **~$20-40/month** | - |

---

## ⚠️ Important Reminders

1. **Always use VPN** before accessing any service
2. **Never use real name** anywhere
3. **Use pseudonym consistently** across all services
4. **Pay with cryptocurrency** when possible
5. **Enable WHOIS privacy** for domain
6. **Save credentials securely** (password manager or encrypted file)
7. **Keep seed phrases secret** (write down, store safely)

---

## 📚 Full Documentation

- **Detailed Guide**: `MAXIMUM_PRIVACY_SETUP_GUIDE.md` (complete step-by-step)
- **Quick Reference**: `QUICK_PRIVACY_SETUP_REFERENCE.md` (checklist)
- **General Guide**: `ANONYMOUS_DEPLOYMENT_GUIDE.md` (overview)

---

## 🎯 Ready to Start?

**First Step**: Connect to VPN, then create ProtonMail account!

Once you've completed Phase 1 (Preparation), let me know and we'll move to Phase 2 (Domain Registration).

---

**Remember**: Stay anonymous, stay secure! 🔐

