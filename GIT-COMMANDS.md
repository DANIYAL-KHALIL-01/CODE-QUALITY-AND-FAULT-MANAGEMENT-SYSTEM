# 🚀 Essential Git & GitHub Commands

## **1. INITIAL SETUP**

```powershell
# Configure git (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize a new repository
git init

# Clone an existing repository
git clone https://github.com/username/repo-name.git
```

---

## **2. DAILY WORKFLOW (Most Used)**

### **Check Status**
```powershell
git status          # See what changed
git log --oneline   # See commit history
git diff            # See exact changes
```

### **Make a Commit**
```powershell
git add .                    # Stage all changes
git add filename.txt         # Stage specific file
git commit -m "message"      # Commit changes
git push origin main         # Push to GitHub
```

### **Pull Latest Changes**
```powershell
git pull origin main         # Get updates from GitHub
```

---

## **3. BRANCHING (For Features)**

```powershell
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature/new-feature

# List branches
git branch -a

# Delete branch
git branch -d feature/new-feature

# Merge branch to main
git checkout main
git merge feature/new-feature
git push origin main
```

---

## **4. VERSIONING (Releases)**

```powershell
# Create a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# List all tags
git tag -l

# Push tag to GitHub
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete tag
git tag -d v1.0.0
```

---

## **5. ROLLBACK & UNDO (When Something Breaks)**

### **Safe Undo (Recommended)**
```powershell
# Undo last commit (keeps changes)
git reset HEAD~1

# Undo last commit safely (creates undo commit)
git revert HEAD
git push origin main

# Go back to previous version
git checkout v1.0.0
```

### **Hard Undo (Use Carefully)**
```powershell
# Go back to previous commit and delete new changes
git reset --hard HEAD~1

# Go back to specific version
git reset --hard v1.0.0

# Force push (⚠️ Only if not shared!)
git push origin main --force
```

---

## **6. VIEW HISTORY & LOGS**

```powershell
# See all commits
git log

# See commits one-line
git log --oneline

# See commits with branches
git log --oneline --all --decorate

# See what changed in last commit
git show HEAD

# See who changed what
git blame filename.txt
```

---

## **7. REMOTE & GITHUB**

```powershell
# View remote repositories
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Remove remote
git remote remove origin

# Fetch updates (don't merge)
git fetch origin

# Push to GitHub
git push origin main

# Pull from GitHub
git pull origin main
```

---

## **8. STASHING (Save Work Temporarily)**

```powershell
# Save changes without committing
git stash

# List stashed changes
git stash list

# Apply stashed changes
git stash apply

# Drop stashed changes
git stash drop
```

---

## **9. CONFLICTS (When Merges Fail)**

```powershell
# See conflicts
git status

# After fixing conflicts manually, stage and commit
git add .
git commit -m "Resolve merge conflicts"

# Abort merge if needed
git merge --abort
```

---

## **10. PRACTICAL WORKFLOW EXAMPLE**

```powershell
# 1. Pull latest code
git pull origin main

# 2. Create feature branch
git checkout -b feature/bug-fix

# 3. Make changes and commit
git add .
git commit -m "fix: Fix bug in analyzer"

# 4. Push feature branch
git push origin feature/bug-fix

# 5. On GitHub: Create Pull Request (PR)
# (Wait for review & approval)

# 6. Merge to main
git checkout main
git pull origin main
git merge feature/bug-fix
git push origin main

# 7. Delete branch
git branch -d feature/bug-fix
git push origin --delete feature/bug-fix

# 8. Create version tag
git tag -a v1.1.0 -m "Version 1.1.0"
git push origin v1.1.0
```

---

## **11. COMMIT MESSAGE BEST PRACTICES**

```
Format: <type>: <description>

Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation
- style:    Code style (formatting)
- refactor: Code refactoring
- test:     Tests
- chore:    Maintenance

Examples:
✅ git commit -m "feat: Add user authentication"
✅ git commit -m "fix: Fix crash in analyzer"
✅ git commit -m "docs: Update README"
❌ git commit -m "updated stuff"
```

---

## **12. QUICK REFERENCE TABLE**

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Pull | `git pull origin main` |
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout branch-name` |
| Merge branch | `git merge branch-name` |
| View history | `git log --oneline` |
| Create version | `git tag -a v1.0.0 -m "message"` |
| Undo safely | `git revert HEAD` |
| Undo hard | `git reset --hard HEAD~1` |

---

## **13. HELP COMMANDS**

```powershell
# Get help
git help
git help commit
git help push

# Check git version
git --version

# See all git config
git config --list
```

---

## **⚡ MOST USED COMMANDS (95% of Daily Work)**

```powershell
git status
git add .
git commit -m "message"
git push origin main
git pull origin main
git log --oneline
git checkout -b feature/name
git merge feature/name
git revert HEAD
git tag -a v1.0.0 -m "Release"
```

---

**Save this file & bookmark it! 🎯**
