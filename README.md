# Gordon's Desk — shared dashboard script

This repo holds `desk.js`, the whole Gordon's Desk dashboard (Wheel & Anchor, Office of the CEO).
It is published to npm as `wa-gordons-desk` and served by jsDelivr. Each person's Claude artifact is a
thin shell (`shell.html`) that loads it, so every copy runs the same structure while reading that
person's own Monday, Gmail and Google Calendar through their own connectors.

**The script holds no data.** Nothing about tasks, emails or events is stored here or in npm.

- `gordons-desk.html` — the source page Elsa edits with Claude
- `build.js` — splits the source into `dist/desk.js`
- `shell.html` — the page each person publishes once from their own Claude
- Releasing: bump `version` in `package.json`, commit, tag `vX.Y.Z`, push the tag. GitHub Actions publishes to npm; every shell picks it up on next refresh (shells load `@1`, so bump the major only for a breaking change).
