# 🌐 Register Domain with Njalla - Complete Guide

## ✅ Prerequisites

Before starting, make sure you have:

- [x] **VPN connected** (Mullvad VPN)
- [x] **ProtonMail account** created
- [ ] **Monero wallet** (Cake Wallet) with ~€15-30 worth of Monero
- [ ] **Pseudonym** chosen (fake name to use)
- [ ] **Domain name** idea ready (e.g., `yourclassifieds.com`)

---

## 🚀 **Step-by-Step: Register Domain**

### **Step 1: Connect via VPN + Tor (Recommended)**

1. **Connect Mullvad VPN** (already done ✅)
2. **Open Tor Browser** (optional but recommended for maximum privacy)
   - Download: https://www.torproject.org
   - Or skip if you prefer (VPN alone is OK)

### **Step 2: Access Njalla Website**

1. **Go to**: https://njal.la
2. **Verify**: You're on the correct website (check URL carefully)
3. **Review**: Privacy policy and terms of service (optional but recommended)

### **Step 3: Create Njalla Account**

1. **Click**: "Sign Up" or "Create Account" (top right corner)

2. **Fill in registration form**:
   - **Email**: `yourpseudonym@protonmail.com` (use your ProtonMail)
   - **Password**: Generate strong password (use password manager)
   - **Confirm Password**: Re-enter password
   - **⚠️ Don't provide**: Phone number, real name, or personal information

3. **Complete CAPTCHA** (if required)

4. **Click**: "Sign Up" or "Create Account"

5. **Check ProtonMail**:
   - Open your ProtonMail inbox
   - Look for verification email from Njalla
   - Click verification link
   - Return to Njalla website

6. **Add PGP Key** (Required for 2FA):
   - Njalla requires PGP key before enabling 2FA
   - **Quick Option**: Create PGP key with Kleopatra (GPG4win) - 5 minutes
   - **Guide**: See `CREATE_PGP_KEY_FOR_NJALLA.md` for detailed steps
   - **Simple Steps**:
     1. Download GPG4win: https://www.gpg4win.org
     2. Install and open Kleopatra
     3. Click "New" → Create key (use pseudonym + ProtonMail email)
     4. Right-click key → Export → Copy public key
     5. Paste into Njalla PGP Key field → Save
   - **Or Skip**: If PGP is optional, you can skip for now (less secure)

7. **Enable 2FA** (Two-Factor Authentication) - **Highly Recommended**:
   - Only available after PGP key is added
   - Go to account settings → 2FA section
   - Enable 2FA
   - Use authenticator app (Authy, Google Authenticator)
   - Scan QR code
   - Enter verification code
   - **Save backup codes** securely (in case you lose access)

### **Step 4: Search for Domain Name**

1. **Go to**: Domain registration page (or homepage search box)

2. **Search for your domain**:
   - Enter domain name: `yourclassifieds.com` (or your preferred name)
   - Click "Search" or press Enter

3. **Check availability**:
   - ✅ **Available**: Green checkmark, shows price
   - ❌ **Not Available**: Shows who owns it or suggests alternatives

4. **If not available**:
   - Try different TLD (.net, .org, .info)
   - Try different name
   - Try different variations

5. **If available**: Proceed to next step

### **Step 5: Choose Domain Settings**

**Select TLD** (Top-Level Domain):
- `.com` - Most common, trusted ($15-30/year) ⭐ Recommended
- `.net` - Alternative, professional ($15-30/year)
- `.org` - For organizations ($15-30/year)
- `.info` - Informational, cheaper ($10-15/year)
- **Recommendation**: Choose `.com` if available (most trusted)

**Registration Period**:
- **1 year**: €15-30/year (minimum)
- **2-3 years**: Better privacy (fewer renewals, saves time)
- **Recommendation**: Choose 1-3 years based on budget

### **Step 6: Configure Domain Settings**

When adding domain to cart, configure:

1. **WHOIS Privacy**:
   - ✅ **Enable**: WHOIS privacy protection (should be FREE/included)
   - This hides your registration details from public WHOIS database
   - **IMPORTANT**: Make sure this is enabled!

2. **Domain Lock**:
   - ✅ **Enable**: Domain lock (prevents unauthorized transfers)
   - This protects your domain from being stolen/transferred

3. **Auto-Renewal**:
   - ⚠️ **Consider**: Enable auto-renewal (convenient but requires payment method)
   - ⚠️ **Alternative**: Disable and renew manually (more privacy, but remember to renew!)

4. **DNS Settings**:
   - **Default**: Use Njalla's DNS (temporary)
   - **Later**: We'll change to Cloudflare DNS (after CDN setup)

### **Step 7: Add to Cart and Checkout**

1. **Click**: "Add to Cart" or "Register"

2. **Review cart**:
   - Verify domain name
   - Verify TLD
   - Verify registration period
   - Verify total cost

3. **Go to checkout**

4. **Fill in registration details** (if required):
   - **Name**: Use your pseudonym (e.g., "Alex Smith")
   - **Email**: Your ProtonMail address
   - **Organization**: Leave empty or use fake name
   - **Address**: Use fake address or Njalla's address (if allowed)
   - **Phone**: Leave empty if possible
   - **Country**: Choose privacy-friendly country (Switzerland, Iceland, etc.)

### **Step 8: Choose Payment Method**

1. **Select Payment Method**: 
   - Choose: **Monero (XMR)** ⭐ Recommended for anonymity
   - Alternative: Bitcoin (BTC) if Monero not available

2. **Review payment amount**:
   - Total: €15-30 (depends on TLD and years)
   - Shows in Monero (XMR) amount

### **Step 9: Pay with Monero**

**IMPORTANT**: Have your Monero wallet ready!

1. **Copy Monero payment address** from Njalla:
   - Example: `4ABC123...` (long string of characters)
   - ⚠️ **Double-check** you copied it correctly

2. **Open Cake Wallet** (your Monero wallet):
   - Launch Cake Wallet app
   - Unlock wallet with password

3. **Send Monero**:
   - Click "Send" or "Transfer"
   - **Paste payment address** from Njalla
   - **Enter exact amount** shown in Njalla (in XMR)
   - **Review everything** carefully:
     - ✅ Address is correct
     - ✅ Amount is correct
   - **Click**: "Send" or "Confirm"
   - **Confirm** transaction (may ask for password)

4. **Wait for confirmation**:
   - Monero transactions take **10-20 minutes** to confirm
   - You'll see "Pending" then "Confirmed" in wallet
   - Blockchain confirmations needed: Usually 10 confirmations

5. **Check Njalla**:
   - Return to Njalla website
   - Check payment status
   - Should show "Pending" → "Confirmed" after blockchain confirmation
   - Wait up to 30 minutes if needed

### **Step 10: Verify Domain Registration**

1. **Check Njalla dashboard**:
   - Login to Njalla account
   - Go to "Domains" or "My Domains"
   - Verify domain appears in list
   - Verify status is "Active" or "Registered"

2. **Verify WHOIS privacy**:
   - Go to domain settings
   - Check: WHOIS privacy is enabled ✅

3. **Verify domain lock**:
   - Check: Domain lock is enabled ✅

4. **Test domain** (optional):
   - Open browser (can turn off VPN temporarily for test)
   - Go to: `http://yourdomain.com`
   - Should show placeholder page or Njalla default page
   - This confirms domain is active

5. **Check WHOIS** (verify privacy):
   - Go to: https://whois.net
   - Search for: Your domain name
   - **Expected**: Should show Njalla's information (NOT yours)
   - **If it shows your info**: WHOIS privacy is NOT enabled - fix this!

6. **Save domain information**:
   - Domain name: `yourdomain.com`
   - Njalla account email: `yourpseudonym@protonmail.com`
   - Expiration date: (write it down!)
   - DNS nameservers: (we'll change these later for Cloudflare)

---

## ⚠️ **Important Security Reminders**

1. **Always use VPN** when accessing Njalla
2. **Use Tor Browser** for sensitive operations (optional but recommended)
3. **Enable WHOIS privacy** - Critical for anonymity!
4. **Enable domain lock** - Protects your domain
5. **Never use real name** - Always use pseudonym
6. **Use anonymous email** - Your ProtonMail address
7. **Enable 2FA** - Protects your account
8. **Save credentials** - Store Njalla login securely

---

## 🔍 **Troubleshooting**

### Problem 1: Payment Not Confirming After 30 Minutes

**Solution**:
- Check Monero wallet - is transaction confirmed?
- Check blockchain explorer: https://www.exploremonero.com
- Contact Njalla support if blockchain shows confirmed but Njalla doesn't

### Problem 2: WHOIS Shows Your Real Information

**Solution**:
- Go to Njalla dashboard → Domain settings
- Enable WHOIS privacy
- Wait 24-48 hours for changes to propagate
- Check again at whois.net

### Problem 3: Can't Find Domain in Njalla Dashboard

**Solution**:
- Wait 5-10 minutes (sometimes takes time)
- Check email for confirmation
- Contact Njalla support if still not showing

### Problem 4: Monero Transaction Failed

**Solution**:
- Check you have enough Monero (including fees)
- Verify payment address is correct
- Try again with new payment address from Njalla

---

## 📋 **Checklist**

Before starting:
- [ ] VPN connected (Mullvad)
- [ ] Tor Browser ready (optional)
- [ ] ProtonMail account ready
- [ ] Monero wallet ready (Cake Wallet)
- [ ] Have ~€15-30 worth of Monero
- [ ] Pseudonym chosen
- [ ] Domain name idea ready

After registration:
- [ ] Domain registered successfully
- [ ] WHOIS privacy enabled
- [ ] Domain lock enabled
- [ ] 2FA enabled on Njalla account
- [ ] Domain information saved securely
- [ ] WHOIS verified (shows Njalla's info, not yours)

---

## 🎯 **Next Steps After Domain Registration**

Once domain is registered:

1. **Phase 3**: Get VPS hosting (1984 Hosting) - Pay with Bitcoin
2. **Phase 4**: Configure server security
3. **Phase 7**: Set up Cloudflare CDN (we'll update DNS then)

---

## 💰 **Cost**

- **Domain registration**: €15-30/year (depends on TLD)
- **WHOIS privacy**: Free (included)
- **Domain lock**: Free (included)
- **Total**: €15-30/year

---

## 📚 **Additional Resources**

- **Njalla Help**: https://njal.la/docs
- **Njalla Support**: Email support (check their website)
- **Monero Guide**: https://www.getmonero.org/getting-started/
- **WHOIS Check**: https://whois.net

---

## ✅ **Ready to Start?**

1. **Connect VPN** ✅
2. **Open Tor Browser** (optional)
3. **Go to**: https://njal.la
4. **Follow steps above**

**Good luck! Once domain is registered, we'll move to hosting setup!** 🚀

