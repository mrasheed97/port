# Port — Investment Terminal

Institutional-grade stock research, GEX dashboard, and 401k tracker.

---

## Deploy to Netlify (5 steps)

### Step 1 — Unzip and open the folder
Unzip `port.zip` and open the `port` folder in Terminal:
```bash
cd ~/Downloads/port
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Test locally (optional but recommended)
Install Netlify CLI if you don't have it:
```bash
npm install -g netlify-cli
```
Run locally (this emulates Netlify Functions too):
```bash
netlify dev
```
Open http://localhost:8888 — the full app should load.

### Step 4 — Connect to your Netlify account
```bash
netlify login
netlify init
```
- Choose **"Create & configure a new site"**
- Pick your team
- Give it a name like `port-terminal`

### Step 5 — Set your API key and deploy
```bash
netlify env:set ANTHROPIC_API_KEY sk-ant-YOUR_KEY_HERE
netlify deploy --prod
```

That's it. Netlify prints your live URL — something like `https://port-terminal.netlify.app`

---

## Adding your Finnhub key

After deploying, open the app → click **Settings** in the top right → paste your Finnhub API key.
Get a free key at https://finnhub.io (takes 30 seconds).

---

## Install as a Mac app (dock icon)

1. Open your Netlify URL in Chrome
2. Click ⋮ → Save and share → Install as app
3. Drag from `/Applications` to your dock

---

## Project structure

```
port/
├── netlify/
│   └── functions/
│       └── ai.js          ← Anthropic API proxy (keeps your key server-side)
├── src/
│   ├── App.jsx            ← Full app
│   └── main.jsx           ← React entry point
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml           ← Build + redirect config
```

## Environment variables

| Variable | Where to get it | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com | Yes — for AI research notes |
| Finnhub key (in-app) | finnhub.io | For live stock prices |
| Polygon key (in-app) | polygon.io | For live GEX data |
