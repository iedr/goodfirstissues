# Contributing to Good First Issues

Thank you for your interest in contributing to **Good First Issues**! 🚀  
This guide will help you set up the project locally and start making contributions smoothly.

---

## 📌 About the Project

Good First Issues is a platform designed to help **first-time contributors** find beginner-friendly GitHub issues.  
The platform aggregates issues from open-source repositories using GitHub’s GraphQL API and presents them with filters for languages and categories.

**Website**: https://goodfirstissues.com

---

## ⚙️ Tech Stack

- **Frontend**: [Bootstrap](https://getbootstrap.com/) – for styling and layout
- **Backend**: [Go (Golang)](https://golang.org/) – handles API calls and data processing
- **Automation**: [GitHub Actions](https://docs.github.com/en/actions) – periodic data fetching
- **GraphQL**: GitHub GraphQL API – for retrieving issues and repo metadata

---

## 🛠️ Setting Up Locally

### 1. **Fork the Repository**
Go to the GitHub repo: https://github.com/iedr/goodfirstissues and click the **"Fork"** button on the top right. This creates a copy of the repository under your GitHub account.

### 2. **Clone Your Fork**
Replace `your-username` with your actual GitHub username:

```bash
git clone https://github.com/your-username/goodfirstissues.git
cd goodfirstissues
