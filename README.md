# Jimmy in the House

A little website that serves up one quirky thought a day. It lives at
[tmoessing.website/jimmy-in-the-house](https://tmoessing.website/jimmy-in-the-house/).

## Features

- 🎯 **Daily Thoughts**: Everyone sees the same quirky thought each day
- ⏳ **Countdown**: Live timer to the next thought; the page switches over at midnight on its own
- 🗓️ **Past Thoughts**: See yesterday's thought, and tap to see the 4 days before it
- 🔗 **Share Button**: Send today's thought with your phone's share sheet (copies to clipboard on desktop)
- ⚡ **Plain HTML, CSS and JS**: No build step

## Project Structure

```
jimmy_in_the_house_website/
├── index.html              # The page
├── styles.css              # All CSS styles
├── thoughts.txt            # Daily thoughts, one per line
├── logo.jpg                # Logo and favicon
├── apple-touch-icon.png    # Icon for iPhone/iPad bookmarks
├── config.js               # Settings and fallback thoughts
└── js/
    ├── app.js              # Page setup
    └── thoughts.js         # Picks and shows the thoughts
```

## Hosting

This repo has no deploy of its own. The deploy for
[tmoessing/tmoessing.website](https://github.com/tmoessing/tmoessing.website)
copies this repo into its `jimmy-in-the-house/` folder. When you push to `master`,
`.github/workflows/notify-main-site.yml` tells the main site to redeploy. That
needs a `MAIN_SITE_DISPATCH_TOKEN` secret in this repo: a fine-grained token with
"Contents: Read and write" on `tmoessing.website`.

Keep every path relative (`logo.jpg`, not `/logo.jpg`), because the site is
served from a subfolder.

## Running it locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Adding New Thoughts

Edit `thoughts.txt`, one thought per line.

Each day's thought is picked from the date, so every visitor sees the same one.
The list is walked in a shuffled order, and no thought repeats until all of them
have been shown. Adding or removing lines reshuffles the order, so the thought
shown on the day you edit the file will usually change.

## Styling

Change the CSS variables in `styles.css`:

```css
:root {
  --bg1: #5b2aa8;        /* Primary background */
  --bg2: #7044d9;        /* Secondary background */
  --text: #ffffff;       /* Text color */
  --muted: rgba(255,255,255,0.86); /* Muted text */
}
```
