# The Golden Age - Elden Ring Companion App

Welcome to The Golden Age Companion App! This is a lightweight, fully interactive progress tracker and field guide built for the Golden Age Elden Ring mod. 

Whether you are hosting it live via GitHub Pages or running it locally from your desktop, the app operates completely client-side—no external servers, backend databases, or API keys required.

---

## Quick Start

- Live Deployment: Simply navigate to your GitHub Pages URL in any modern web browser.
- Local Use: Double-click index.html or The_Golden_Age_Interactive_Checklist.html to open the app directly from your computer.

---

## Repository & Folder Structure

To keep the site running cleanly and ensure audio and images load without issues, make sure your project files are organized as follows:

├── index.html
├── The_Golden_Age_Interactive_Checklist.html
├── app.css
├── app.js
├── admin.js                  # Salted PBKDF2 administrative terminal (Ctrl+Shift+~)
├── extras.js
├── bosses-data.js
├── rewards-data.js
├── talisman-data.js
├── about.html
├── achievements.html
├── areas.html
├── bosses.html
├── drops.html
├── games.html
├── help.html
├── home.html
├── journal.html
├── notes.html
├── prereqs.html
├── progression.html
├── settings.html
├── talismans.html
├── elden-ring-hero.png        # Main hero image in root
├── 📁 audio/                 # Rarity & completion sound effects (.mp3)
│   ├── common.mp3
│   ├── common_2.mp3
│   ├── common_3.mp3
│   ├── uncommon.mp3
│   ├── uncommon_2.mp3
│   ├── rare.mp3
│   ├── rare_2.mp3
│   ├── epic.mp3
│   ├── epic_2.mp3
│   ├── legendary.mp3
│   ├── legendary_2.mp3
│   ├── legendary_3.mp3
│   └── 100%.mp3
└── 📁 assets/                # Icons and vector graphics
    ├── page-emblems.svg
    └── talisman-emblems.svg

---

## Features & Highlights

### Achievement System & Audio
- 30+ Tiered Achievements: Fully categorized across Common, Uncommon, Rare, Epic, Legendary, and four hidden secret milestones.
- Dynamic Rarity Audio: Plays distinct audio cues upon unlocking achievements based on their rarity tier.
- 100% Completion Track: Features a dedicated completion sound (100%.mp3) that triggers exclusively when every single achievement has been earned.
- Full Control: Search, filter, sort, pin, and view saved unlock notification toasts.

### Boss Intel & Tracker Catalog
- Complete Catalog: Covers 40 mod bosses, 25 prerequisite chains, 77 unique reward IDs across 9 categories, and 25 weapon records.
- Interactive Boss Intel: Click any boss card to open a unified dialog containing locations, prerequisites, drops, verification notes, and quick journal shortcuts.
- Accurate Status Tracking: Every boss is cleanly classified as Defeated, Available, Locked, or Unknown.

### Hidden Talismans Field Guide
- Dedicated tracking page for 8 canonical mod talismans with original SVG emblems.
- Tracks independent collection states, including dependency checks for end-game talismans like Eccentric Corpse.

### Journey Journal & Notes
- Log your adventures, boss encounters, and notes with custom tags, dates, importance ratings, and pinned states.
- Direct shortcuts to prefill journal entries straight from boss cards, area descriptions, and achievements.

### Deep Customization & Admin Control
- 10 Preset Dark-Fantasy Themes: Customize accent colors, typography, background atmosphere, borders, card styles, and reduced-motion preferences.
- Admin Terminal: Press Ctrl + Shift + ~ (backtick) or tap the sidebar title 5 times quickly on mobile to access the built-in cryptographically hashed testing terminal.

---

## Data & Backups

- Local Storage: All your progress, journal entries, pinned bosses, and visual settings are saved automatically in your browser (localStorage).
- Export & Import: Use the Settings & Data menu to export a JSON backup at any time so you can transfer your progress between different browsers or devices safely.
