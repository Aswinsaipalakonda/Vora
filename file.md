# Vora Team Collaboration Workflow Guide

This document details the exact workflow team members should follow to set up, develop, and contribute to the Vora repository.

---

## 1. Cloning the Repository
To get started, clone the repository to your local system:
```bash
git clone https://github.com/Aswinsaipalakonda/Vora.git
cd Vora
```

---

## 2. Environment Configuration
By default, the API endpoint is configured to localhost in `.env.production`.
* Ensure you create a local configuration if needed (e.g., `.env.local`).
* Set up any required API keys (e.g. `GEMINI_API_KEY`) as instructed in the main `README.md`.

---

## 3. Installing Dependencies & Running Locally
Install the required packages and spin up the local development server:
```bash
npm install
npm run dev
```

---

## 4. Development & Branching Strategy
> [!IMPORTANT]
> Never commit directly to the `main` branch. All work must be done in feature branches.

### Step 1: Create a Feature Branch
Before you start coding, sync your local `main` branch with the remote and create a new branch:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```
Use clear naming conventions for branches:
* `feature/feature-description` (e.g., `feature/login-page`)
* `bugfix/issue-description` (e.g., `bugfix/form-validation`)

### Step 2: Write Code & Test Locally
* Ensure your code is formatted and meets the project standards.
* Validate your changes locally by running the development server and running any automated test suites.

---

## 5. Committing and Pushing Changes

### Step 1: Stage and Commit
Stage your changes and write a clear, descriptive commit message:
```bash
git add .
git commit -m "feat: description of the feature or fix added"
```
*Prefer semantic commit prefixes:*
* `feat:` for new features
* `fix:` for bug fixes
* `docs:` for documentation updates
* `refactor:` for code refactoring

### Step 2: Push to GitHub
Push your local branch to the remote repository:
```bash
git push -u origin feature/your-feature-name
```

### Step 3: Open a Pull Request (PR)
1. Go to the GitHub repository web page: [Vora on GitHub](https://github.com/Aswinsaipalakonda/Vora).
2. Click on the **Compare & pull request** button next to your pushed branch.
3. Add a detailed description of the changes you implemented and request review from your teammates.
4. Once reviewed and approved, merge the PR into `main`.
