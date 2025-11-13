# 📚 Git Quick Guide - Common Commands

## 🔧 Basic Git Commands

### Check Status

```bash
# See what files have changed
git status

# See changes in files
git diff

# See changes in a specific file
git diff filename.jsx
```

### Add Files

```bash
# Add all changed files
git add .

# Add a specific file
git add frontend/src/components/Footer.jsx

# Add all files in a directory
git add frontend/src/components/
```

### Commit Changes

```bash
# Commit with a message
git commit -m "Your commit message here"

# Commit all changes (skips git add)
git commit -am "Your commit message here"
```

### Push to GitHub

```bash
# Push to main branch
git push

# Push to specific branch
git push origin main

# Push to specific remote and branch
git push origin main --force
```

### Pull from GitHub

```bash
# Pull latest changes
git pull

# Pull from specific branch
git pull origin main
```

### View History

```bash
# See commit history
git log

# See last 10 commits
git log -10

# See commit history in one line
git log --oneline
```

### Create/Switch Branches

```bash
# Create a new branch
git checkout -b new-branch-name

# Switch to existing branch
git checkout branch-name

# See all branches
git branch

# See current branch
git branch --show-current
```

### Merge Branches

```bash
# Switch to main branch
git checkout main

# Merge another branch into main
git merge branch-name
```

---

## 📋 Complete Workflow Example

### Daily Workflow:

```bash
# 1. Check what changed
git status

# 2. Add all changes
git add .

# 3. Commit with message
git commit -m "Update footer and fix padding"

# 4. Push to GitHub
git push
```

### Workflow with Pull:

```bash
# 1. Pull latest changes first
git pull

# 2. Make your changes
# (edit files...)

# 3. Add changes
git add .

# 4. Commit
git commit -m "Your message"

# 5. Push
git push
```

---

## 🚨 Common Situations

### Undo Changes

```bash
# Discard changes in a file (not committed)
git checkout -- filename.jsx

# Discard all changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### See Remote Repository

```bash
# See remote repository URL
git remote -v

# Add remote repository
git remote add origin https://github.com/username/repo.git

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git
```

### Clone Repository

```bash
# Clone a repository
git clone https://github.com/username/repo.git

# Clone into specific folder
git clone https://github.com/username/repo.git my-folder
```

---

## 🔐 Setup Git (First Time)

### Configure Your Identity

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Check your configuration
git config --list
```

### Initialize New Repository

```bash
# Initialize git in current folder
git init

# Add remote repository
git remote add origin https://github.com/username/repo.git

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

---

## 📝 Your Current Repository

Based on your setup:

```bash
# Your repository: malek-chebil/siteweb
# Main branch: main

# Quick deploy workflow:
cd "C:\Users\Malek\Desktop\site Web"
git status
git add .
git commit -m "Your commit message"
git push
```








---

## 💡 Useful Tips

### Short Status

```bash
# Short version of git status
git status -s
```

### See What Will Be Committed

```bash
# See staged changes
git diff --staged
```

### Create Alias (Shortcuts)

```bash
# Create alias for common commands
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit

# Then use:
git st    # instead of git status
git co    # instead of git checkout
```

---

## 🎯 Quick Reference Card

```
CHECK STATUS:     git status
ADD FILES:        git add .
COMMIT:           git commit -m "message"
PUSH:             git push
PULL:             git pull
SEE CHANGES:      git diff
SEE HISTORY:      git log
CREATE BRANCH:    git checkout -b branch-name
SWITCH BRANCH:    git checkout branch-name
UNDO FILE:        git checkout -- filename
```

---

**Happy Git-ing! 🚀**

