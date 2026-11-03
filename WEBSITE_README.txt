THE GOLDEN AGE COMPANION WEBSITE

Open index.html or The_Golden_Age_Interactive_Checklist.html in a modern browser. The site runs locally without a server or internet access.

Keep these files together: the page HTML files, app.css, app.js, bosses-data.js, rewards-data.js, extras.js, and elden-ring-hero.png. Each page links to the same shared data and localStorage progress. Progress is stored per browser and device; use Settings & Data to export or import a JSON backup.


Recent companion improvements
- Achievements now render a dedicated 30-entry page with Common, Uncommon, Rare, Epic, and Legendary tiers, four secret milestones, search/filter/sort controls, pinning, retroactive evaluation, and saved notifications. Tracked catalog counts reflect 40 mod bosses, 25 shared prerequisite entries, 77 unique reward IDs, nine reward categories, and 25 weapon records.
- The former empty Achievements state came from the default “All statuses” option being treated as a specific status filter, excluding every achievement. The filter now treats that option as inclusive.
- Boss Intel opens from boss cards and gathers the shared boss, prerequisite, reward, source, verification, and personal note records in one accessible dialog.
- assets/page-emblems.svg is original local SVG interface artwork created for this site. It contains reusable icons for the thirteen navigation pages; no external image assets or third-party icon library are loaded. Existing boss records include no portraits, so Boss Intel displays a decorative initials fallback.
- Achievement pins and boss pins are stored in the existing version 3 local tracker object and included in its JSON export/import. Older data without pin fields loads with empty pin lists; existing progress records are retained.


Hidden talismans and status counts
----------------------------------
The navigation includes a dedicated Hidden Talismans page with eight canonical records and original local SVG emblems. The first seven can be collected independently. Eccentric Corpse becomes ready after the first seven are collected, but its own collection state requires a separate manual confirmation. Talismans share the reward collection ledger, so existing JSON backup and restore includes them automatically. The reward catalog, dashboard, progression, prerequisites, and talisman achievements read the same stable talisman IDs. Unspecified and uncertain effect values remain labeled.

Boss states use one mutually exclusive classification: Defeated, Available, Locked, or Unknown. Dashboard and status filters use the same classification so counts add up to the tracked mod boss total.

Appearance personalization and Journey Journal
----------------------------------------------
Settings now include ten coordinated dark-fantasy palettes, editable colors with contrast/status checks, background atmosphere and image controls, four typography presets, responsive layout/surface choices, decorative and emblem treatments, and motion settings. Appearance preferences are saved in the existing goldenAgeSite_v3 localStorage record. Appearance-only JSON import/export changes preferences without touching tracker progress.

Journey Journal is a separate page alongside Notes & To-Do List. It stores entries, dates, types, tags, importance, pin state, and stable links to bosses, areas, rewards/talismans, and achievements in that same local record. Entries can be searched, filtered, sorted, pinned, edited, and deleted with confirmation. Progress-based prompts are optional and never create entries automatically. Journal records are included in full tracker backups. Screenshot attachments are not supported; no journal content is uploaded. Older backups without Journal data remain supported.

The journal can be opened with a prefilled entry form from boss details, area cards, reward/talisman records, and achievement cards.
