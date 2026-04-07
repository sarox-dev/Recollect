# Recollect
[![License][license]][license-url] [![Stars][stars]][stars-url] [![Python][python]][python-url] [![Status][status]][status-url] [![Docker][docker]][docker-url]

Your self-hosted unified search & knowledge memory layer
A single interface to search web, GitHub, local files — and remember everything you found.

## Join Discord
[![Discord][discord]][discord-url]

## 🎯 The Problem
Technical users waste hours re-searching the same information across fragmented sources:

```
Google → GitHub → Local docs → Notes → Bookmarks → Repeat tomorrow
```
### Recollect eliminates this by creating a persistent, unified search layer that:

- Searches web + GitHub + local files simultaneously

- Remembers your past searches, clicks, and useful results

- Turns fragmented info into your personal knowledge system


## 🚀 Core Features
### 1. Unified Search
```
One query → Web results + GitHub repos + Local files + Past searches
```
Powered by SearXNG for web

GitHub API integration

Local file indexing (.txt, .md, code files)


### 2. Search Memory
Every search stored with timestamps, clicked results, notes

Re-run past searches in 1 click

Filter history by keyword/date/source

### 3. Knowledge Organization
Save + tag results into collections

Full-text search across everything you’ve saved

Export/import for backup/portability

### 4. Power User Tools
CLI interface: recollect "docker reverse proxy"

API endpoints for automation

Saved queries + alerts (new GitHub repos, forum posts, etc.)

## 🛠 Tech Stack
```
Backend: FastAPI + SearXNG
Frontend: HTML/CSS/JS
Deployment: Docker Compose
```
## 🎯 Target Users
Developers — quick access to code/docs/solutions

Homelab users — utilize server resources effectively

Power users — heavy technical information consumers

## 📋 MVP Roadmap
### Phase 1 (Current)
SearXNG integration

Basic search UI

Search history storage

Local file indexing

Save + tag system

### Phase 2
GitHub search

CLI tool

Docker deployment

### Phase 3
Saved queries + alerts

API

Browser extension

## 🚀 Quick Start
```bash
# Clone the repo
git clone https://github.com/sarox-dev/Recollect
cd recollect

# Copy environment file
cp .env.example .env

# Edit .env if needed (ports, etc.)

# Run with Docker Compose
docker compose up -d

# Access the app at http://localhost:8000
# SearXNG API at http://localhost:8080 (if exposed)
```
### 💰 Business Model
Free self-hosted core + paid hosted/advanced features:

Hosted SaaS version

Premium: team sync, browser extension, advanced alerts

Enterprise: permissions, SSO, support

### 🤝 Contributing
Fork the repo

Create feature branch (git checkout -b feature/search-memory)

Commit changes (git commit -m 'Add search memory')

Push & open PR

See CONTRIBUTING.md for details.

## 📄 License
MIT © Saroxtech 2026

🙌 Support the Project
⭐ Star on GitHub
🐛 Report issues
💬 Join Discord

[Live demo](https://recollect.saroxtech.com) coming soon

[discord]: https://img.shields.io/discord/1490718135081242745?style=for-the-badge&logo=discord&logoColor=white&label=Join&labelColor=1e2124&color=7289da
[discord-url]: https://discord.gg/BXEDCJP7mT
[license]: https://img.shields.io/github/license/sarox-dev/Recollect?color=007acc
[license-url]: https://github.com/sarox-dev/Recollect/blob/main/LICENSE
[stars]: https://img.shields.io/github/stars/sarox-dev/Recollect?style=social
[stars-url]: https://github.com/sarox-dev/Recollect
[python]: https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=yellow
[python-url]: https://python.org
[status]: https://img.shields.io/badge/Status-WIP-orange
[status-url]: https://github.com/sarox-dev/Recollect
[docker]: https://img.shields.io/badge/Docker-Compose-green?logo=docker
[docker-url]: https://hub.docker.com
Built for technical users, by a technical user. Let's solve repeated searching together.

Tagline: "Search once. Remember forever."
