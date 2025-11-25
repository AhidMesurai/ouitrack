# Quick GitHub Setup Commands

After creating the repository on GitHub, run these commands:

```bash
# Add the remote repository
git remote add origin https://github.com/AhidMesurai/ouitrack.git

# Verify the remote was added
git remote -v

# Push your code
git push -u origin main
```

## If you get authentication errors:

### Option 1: Use GitHub CLI (if installed)
```bash
gh auth login
git push -u origin main
```

### Option 2: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Netlify Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When pushing, use the token as your password:
   - Username: `AhidMesurai`
   - Password: `YOUR_TOKEN_HERE`

### Option 3: Use SSH (more secure)
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add SSH key to GitHub
# Copy the public key: cat ~/.ssh/id_ed25519.pub
# Then add it to GitHub → Settings → SSH and GPG keys

# Change remote to SSH
git remote set-url origin git@github.com:AhidMesurai/ouitrack.git

# Push
git push -u origin main
```

