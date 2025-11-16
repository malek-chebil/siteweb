# 🔐 Create PGP Key for Njalla - Complete Guide

## ✅ What is PGP?

**PGP (Pretty Good Privacy)** is encryption software that:
- Encrypts emails from Njalla to you
- Adds extra security layer
- Required for 2FA on Njalla
- Keeps communications private

---

## 🎯 **Quick Answer**

**You have 2 options:**

1. **Create PGP Key** (5-10 minutes) - Recommended for security
2. **Skip PGP/2FA** (if not required) - Less secure but works

---

## 🚀 **Option 1: Create PGP Key (Recommended)**

### **Step 1: Download GnuPG (GPG)**

**Windows:**

1. **Download Gpg4win**:
   - Go to: https://www.gpg4win.org
   - Download latest version
   - Install it (includes Kleopatra - GUI tool)

2. **Or use Command Line**:
   - Download: https://www.gpg4win.org/get-gpg4win.html
   - Install GPG4win

**Mac:**

1. **Install via Homebrew**:
   ```bash
   brew install gnupg
   ```

2. **Or download GPG Suite**: https://gpgtools.org

**Linux:**

```bash
sudo apt install gnupg
```

### **Step 2: Create PGP Key**

#### **Method A: Using Kleopatra (Windows GUI - Easiest)**

1. **Open Kleopatra** (comes with GPG4win)

2. **Create New Key Pair**:
   - Click "File" → "New Certificate" or click "New" button
   - Or click "New Key Pair" button

3. **Configure Key**:
   - **Name**: Use your pseudonym (e.g., "Alex Smith")
   - **Email**: Your ProtonMail address (`yourpseudonym@protonmail.com`)
   - **Advanced Settings**: Click "Advanced Settings"
     - **Key Type**: RSA (recommended)
     - **Key Size**: 4096 bits (recommended - strongest)
     - **Expiration**: Set to never expire (or 2-3 years)
   - Click "OK"

4. **Set Passphrase**:
   - Enter strong passphrase (save it securely!)
   - Confirm passphrase
   - Click "Create"

5. **Wait for Generation**:
   - Key generation takes 1-5 minutes
   - Move mouse randomly to generate entropy (helps speed up)

6. **Key Created**:
   - You'll see your key in Kleopatra window
   - Status should show "Valid"

#### **Method B: Using Command Line (All Platforms)**

1. **Open Terminal/Command Prompt**

2. **Generate Key**:
   ```bash
   gpg --full-generate-key
   ```

3. **Follow Prompts**:
   ```
   Please select what kind of key you want:
      (1) RSA and RSA (default)
      (2) DSA and Elgamal
      (3) DSA (sign only)
      (4) RSA (sign only)
   Your selection? 1
   
   RSA keys may be between 1024 and 4096 bits long.
   What keysize do you want? (3072) 4096
   
   Please specify how long the key should be valid.
         0 = key does not expire
        <n>  = key expires in n days
        <n>w = key expires in n weeks
        <n>m = key expires in n months
        <n>y = key expires in n years
   Key is valid for? (0) 0
   
   Is this correct? (y/N) y
   
   Real name: Alex Smith
   Email address: yourpseudonym@protonmail.com
   Comment: Njalla Domain Registration
   You selected this USER-ID:
       "Alex Smith (Njalla Domain Registration) <yourpseudonym@protonmail.com>"
   
   Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
   
   Enter passphrase: [Enter strong passphrase - save it!]
   Repeat passphrase: [Confirm]
   ```

4. **Wait for Generation**:
   - Move mouse or type randomly to generate entropy
   - Takes 1-5 minutes

5. **Key Created Successfully**:
   ```
   gpg: key ABC123DEF456 marked as ultimately trusted
   public and secret key created and signed.
   ```

### **Step 3: Export Public Key**

#### **Method A: Using Kleopatra**

1. **Right-click your key** in Kleopatra
2. **Click**: "Export" → "Export Certificates"
3. **Save as**: `njalla-public-key.asc`
4. **Open file**: Copy the entire content (it's your public key)

#### **Method B: Using Command Line**

1. **List your keys**:
   ```bash
   gpg --list-keys
   ```
   - Note your key ID (the long string after "pub")

2. **Export public key**:
   ```bash
   gpg --armor --export yourpseudonym@protonmail.com > njalla-public-key.asc
   ```
   - Or replace email with your key ID

3. **Open file**: `njalla-public-key.asc`
   - Copy entire content (this is your public key)

**Your public key looks like this**:
```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBF... [long string of characters] ...
...ABC123...
-----END PGP PUBLIC KEY BLOCK-----
```

### **Step 4: Add PGP Key to Njalla**

1. **Go to Njalla account settings**:
   - Login to Njalla
   - Go to "Settings" or "Account Settings"
   - Find "PGP Key" section

2. **Paste Public Key**:
   - Paste your entire public key (including `-----BEGIN` and `-----END` lines)
   - Make sure to include everything
   - Click "Save" or "Update"

3. **Verify**:
   - Should show "PGP Key saved" or similar
   - Should show key fingerprint or email

### **Step 5: Enable 2FA (Now Available)**

1. **Go to 2FA settings** in Njalla
2. **Enable 2FA**:
   - Should now be available (after PGP key added)
   - Use authenticator app (Authy, Google Authenticator)
   - Scan QR code
   - Enter verification code
   - **Save backup codes** securely!

---

## ⚠️ **Option 2: Skip PGP/2FA (Less Secure)**

**If you want to skip PGP setup:**

### **Can You Skip It?**

- ⚠️ **Check Njalla requirements**: Some features may require PGP
- ⚠️ **Security risk**: Without PGP, emails from Njalla are not encrypted
- ✅ **Can still register domain**: PGP is usually optional for basic registration

### **If You Skip:**

1. **Leave PGP key field empty** (if possible)
2. **Proceed with domain registration**
3. **Consider adding PGP later** for better security

---

## 🔒 **Security Best Practices**

### **For PGP Key:**

1. **Store Private Key Securely**:
   - Never share private key
   - Backup key securely (encrypted)
   - Store passphrase safely

2. **Keep Passphrase Safe**:
   - Write it down securely
   - Don't store digitally (unless encrypted)
   - Remember it (needed to decrypt emails)

3. **Backup Your Key**:
   ```bash
   # Export private key (BACKUP SECURELY!)
   gpg --armor --export-secret-keys yourpseudonym@protonmail.com > njalla-private-key-backup.asc
   ```
   - ⚠️ **Store this VERY securely** (encrypted, offline)
   - If lost, cannot decrypt emails from Njalla

4. **Don't Upload to Key Servers** (as Njalla suggests):
   - Keep key private
   - Only share with Njalla (via their form)
   - Don't publish publicly

---

## 📋 **Quick Checklist**

**Creating PGP Key:**

- [ ] Download and install GnuPG (GPG4win, GPG Suite, or `gnupg`)
- [ ] Create new key pair
  - [ ] Use pseudonym for name
  - [ ] Use ProtonMail email
  - [ ] Set key size to 4096 bits
  - [ ] Set strong passphrase
- [ ] Export public key
- [ ] Copy entire public key (including BEGIN/END lines)
- [ ] Paste into Njalla PGP Key field
- [ ] Save in Njalla
- [ ] Enable 2FA (now available)
- [ ] Save backup codes for 2FA

**Security:**

- [ ] Backup private key securely
- [ ] Save passphrase securely
- [ ] Don't upload key to public servers
- [ ] Keep private key offline

---

## 🎯 **Simplified Steps (Fastest)**

**If you want the quickest way:**

1. **Download GPG4win** (Windows): https://www.gpg4win.org
2. **Install and open Kleopatra**
3. **Click "New"** → Create key with pseudonym + ProtonMail email
4. **Right-click key** → Export → Copy public key
5. **Paste into Njalla** → Save
6. **Enable 2FA** → Done!

**Time**: 5-10 minutes

---

## 🔍 **Troubleshooting**

### Problem 1: "Invalid PGP Key" in Njalla

**Solutions**:
- Make sure you copied **entire key** (including `-----BEGIN` and `-----END`)
- No extra spaces or line breaks
- Key must be valid (test it locally first)
- Try regenerating key if needed

### Problem 2: Can't Decrypt Emails from Njalla

**Solutions**:
- Need your **private key** to decrypt
- Need your **passphrase**
- Use Kleopatra or command line:
  ```bash
  gpg --decrypt encrypted-message.txt
  ```

### Problem 3: Forgot Passphrase

**Solutions**:
- ⚠️ **Cannot recover** - passphrase is not stored anywhere
- Need to create new key
- Update Njalla with new public key

### Problem 4: Lost Private Key

**Solutions**:
- ⚠️ **Cannot recover encrypted emails** if private key lost
- Create new key pair
- Update Njalla with new public key
- **Always backup private key securely!**

---

## ✅ **Recommended Approach**

**For Maximum Privacy & Security:**

1. **Create PGP key** (10 minutes)
   - Use Kleopatra (easiest)
   - Pseudonym + ProtonMail email
   - 4096-bit RSA key
   - Strong passphrase

2. **Export and add to Njalla**
   - Copy public key
   - Paste in Njalla
   - Save

3. **Enable 2FA**
   - Use authenticator app
   - Save backup codes

4. **Backup everything**
   - Private key (encrypted, offline)
   - Passphrase (secure storage)
   - 2FA backup codes

---

## 📚 **Additional Resources**

- **GnuPG Official**: https://gnupg.org
- **GPG4win**: https://www.gpg4win.org
- **Kleopatra Manual**: https://docs.kde.org/stable5/en/kdepim/kleopatra/
- **PGP Tutorial**: https://www.gnupg.org/gph/en/manual.html

---

## 🚀 **Ready to Create PGP Key?**

1. **Download GPG4win** (or GnuPG for your OS)
2. **Open Kleopatra**
3. **Create new key** (follow steps above)
4. **Export public key**
5. **Add to Njalla**
6. **Enable 2FA**

**Once done, continue with domain registration!** 🔐

