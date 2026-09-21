# Leadflow

A lead pipeline app: accounts and login, real business search through Google Places, a private list of leads you can filter, sort, annotate and delete, and a free website audit that scores how much work each prospect's site needs.
AI demo generation and outreach come in later phases — the pages for them exist but are empty on purpose.

This guide assumes you have **never used a terminal before**. Every command you need to type is written out in full. Follow the parts in order.

---

## Table of contents

1. [What you need installed](#1-what-you-need-installed)
2. [How to open a terminal](#2-how-to-open-a-terminal)
3. [Create your free Supabase project and get the keys](#3-create-your-free-supabase-project-and-get-the-keys)
4. [Create the database tables](#4-create-the-database-tables)
5. [Get your Google Places API key](#5-get-your-google-places-api-key)
6. [Put your keys into the app](#6-put-your-keys-into-the-app)
7. [Run the app on your own computer](#7-run-the-app-on-your-own-computer)
8. [Push the code to GitHub](#8-push-the-code-to-github)
9. [Deploy to Vercel for free](#9-deploy-to-vercel-for-free)
10. [Tell Supabase about your live URL](#10-tell-supabase-about-your-live-url-important)
11. [Connect a custom domain](#11-connect-a-custom-domain)
12. [Everyday commands](#12-everyday-commands)
13. [If something goes wrong](#13-if-something-goes-wrong)
14. [How the website audit works](#14-how-the-website-audit-works)
15. [What's in this project](#15-whats-in-this-project)

---

## 1. What you need installed

Install these three things first. Each one is free.

| What | Where to get it | Why |
|---|---|---|
| **Node.js** (version 18.17 or newer — pick the "LTS" button) | https://nodejs.org | Runs the app |
| **Git** | https://git-scm.com/downloads | Sends your code to GitHub |
| **VS Code** (a code editor) | https://code.visualstudio.com | Lets you open and edit the files |

Install each one with all the default options. On Windows, when the Git installer asks questions, just keep clicking **Next**.

You also need free accounts on these three sites. Sign up now, it takes a minute each:

- https://supabase.com — the database and login system
- https://github.com — where your code lives
- https://vercel.com — puts your app on the internet (sign up using your GitHub account)

---

## 2. How to open a terminal

The terminal is a window where you type commands.

**Windows:** press the Windows key, type `powershell`, press Enter.
**Mac:** press `Cmd + Space`, type `terminal`, press Enter.

**How to check it worked.** Type this and press Enter:

```
node -v
```

You should see something like `v20.11.0`. If you instead see "command not found" or "not recognized", Node.js isn't installed — go back to step 1, then **close the terminal and open a new one**.

Now check Git the same way:

```
git -v
```

You should see something like `git version 2.43.0`.

> **Three things to know about the terminal:**
> - Type one command, press Enter, wait for it to finish, then type the next one.
> - `cd` means "go into this folder". `cd Desktop` moves you into your Desktop folder.
> - If a folder name has a space in it, wrap the path in quotes: `cd "My Projects"`.

---

## 3. Create your free Supabase project and get the keys

Supabase gives you a database and a login system. The free plan is enough.

1. Go to https://supabase.com and click **Start your project**. Sign in with GitHub.
2. Click **New project**.
3. Fill in:
   - **Name:** `leadflow`
   - **Database Password:** click **Generate a password**, then **copy it and save it somewhere safe** (a notes app is fine). You won't need it for this app, but you can never see it again.
   - **Region:** pick the one closest to you. For Pakistan, `South Asia (Mumbai)` or `Southeast Asia (Singapore)` are the closest.
4. Click **Create new project**. It takes about two minutes to finish setting up.

### Get your three keys

Once the project is ready:

1. In the left sidebar click the gear icon (**Project Settings**).
2. Click **API**.
3. You'll see three things you need. Copy each one into a notes file for a moment:

| On the Supabase page | What it looks like | You'll call it |
|---|---|---|
| **Project URL** | `https://abcdefgh.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **Project API keys → `anon` `public`** | a very long string starting `eyJ...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Project API keys → `service_role` `secret`** | another long string starting `eyJ...` (click **Reveal**) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **The `service_role` key is a master key.** It ignores all the security rules. Never paste it into a chat, a screenshot, a public repo, or any file that starts with `NEXT_PUBLIC_`. This app doesn't use it yet — you're only saving it for later phases.

---

## 4. Create the database tables

1. Still in Supabase, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/migrations/0001_init.sql` from this project in VS Code, select everything (`Ctrl + A` on Windows, `Cmd + A` on Mac), copy it (`Ctrl + C` / `Cmd + C`).
4. Paste it into the Supabase query box.
5. Click **Run** (bottom right).

You should see **Success. No rows returned**. That's correct — it built the table rather than fetching anything.

**Now do the same with the second file.** Click **New query** again, and this time paste in `supabase/migrations/0002_provider_place_id.sql`. Run it.

Run them in order — `0001` first, then `0002`. If you set up this project before Phase 2, you already ran `0001`, so you only need `0002`. Running a file twice does no harm.

### Check the security worked

1. Click **Table Editor** in the left sidebar. You should see a table called `leads`.
2. Click **Authentication** → **Policies**. You should see the `leads` table with **4 policies** listed and RLS marked as enabled.

Those four policies are what stops one user seeing another user's leads. If you ever see "RLS disabled" on a table, fix it before putting real data in.

---

## 5. Get your Google Places API key

This is what makes the **Find Leads** search return real businesses. Without it the search page tells you it isn't configured, and everything else in the app still works.

### Create the key

1. Go to https://console.cloud.google.com and sign in with a Google account.
2. At the top of the page click the project dropdown → **New Project**. Name it `leadflow` and click **Create**. Wait a few seconds, then make sure that project is selected in the dropdown.
3. In the search bar at the top, type **Places API (New)** and click it in the results.
4. Click **Enable**.
5. In the left sidebar go to **APIs & Services** → **Credentials**.
6. Click **Create credentials** → **API key**.
7. Copy the key it shows you. It starts with `AIza...`.

### Turn on billing (required, even for free usage)

Google will not answer a single Places request until billing is enabled — this catches everybody out.

1. In the left sidebar go to **Billing**.
2. Click **Link a billing account** → **Create billing account**.
3. Enter your card details and confirm.

**You are not charged for normal use of this app.** Google applies a recurring **monthly free credit** to Maps and Places usage, and a few hundred searches a month sits well inside it.

But the free credit is **not a hard limit**. If you blow past it, the card gets charged. Spend five minutes setting up both of these guards now:

**A budget alert** — emails you before anything goes wrong:
1. **Billing** → **Budgets & alerts** → **Create budget**.
2. Set the amount to something small, like $5.
3. Tick the alert thresholds and finish. Google emails you when you cross them.

**A hard daily cap** — actually stops the requests:
1. **APIs & Services** → **Places API (New)** → **Quotas & System Limits**.
2. Find the requests-per-day quota, click the pencil icon, and set it to something sane like `500`.
3. Save.

With a daily cap in place, a bug or a runaway loop can't produce a surprise bill — the search just stops working until tomorrow.

### Lock the key down

An API key sitting unrestricted on the internet can be found and spent by someone else.

1. **APIs & Services** → **Credentials** → click your key's name.
2. Under **API restrictions**, choose **Restrict key** and tick only **Places API (New)**.
3. Leave **Application restrictions** as **None**. This key is only ever used from the server, never from a browser, so there's no website or IP to restrict it to. (Vercel's server IPs change, so an IP restriction would break the app.)
4. **Save**.

### Where to paste it

The key goes into `.env.local` as `GOOGLE_PLACES_API_KEY` in the next step, and into Vercel's environment variables when you deploy. Note there is **no** `NEXT_PUBLIC_` on the front of that name — that's deliberate. Anything starting with `NEXT_PUBLIC_` is visible to anyone who opens your site, and this key must stay on the server.

---

## 6. Put your keys into the app

1. Open VS Code. Go to **File → Open Folder** and pick the `leadflow` folder.
2. In the file list on the left, find the file called `.env.example`.
3. Right-click it → **Copy**, then right-click in the empty space below → **Paste**. Rename the copy to exactly:

```
.env.local
```

4. Open `.env.local` and replace the placeholder values with your real ones from step 3:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-real-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-real-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_PLACES_API_KEY=AIza...your-real-google-places-key
ANTHROPIC_API_KEY=
```

5. Save the file (`Ctrl + S` / `Cmd + S`).

Leave `ANTHROPIC_API_KEY` empty. It's a placeholder for the audit and demo features later.

If you skip `GOOGLE_PLACES_API_KEY` for now, the app still runs — the Find Leads page just tells you search isn't configured instead of crashing.

> `.env.local` is already listed in `.gitignore`, so it will never be uploaded to GitHub. That's deliberate. Don't remove that line.

---

## 7. Run the app on your own computer

> **Updating from an earlier phase?** Each phase adds a package, so run `npm install` again after copying in the new files. Then carry on as normal.

Open a terminal (step 2). Now move into the project folder. If the `leadflow` folder is on your Desktop, type:

```
cd Desktop/leadflow
```

**Command 1 — install everything the app needs.** This downloads a few hundred files into a `node_modules` folder and takes 1–3 minutes:

```
npm install
```

**Command 2 — start the app:**

```
npm run dev
```

You'll see something like `ready - started server on http://localhost:3000`.

Open your browser and go to:

```
http://localhost:3000
```

**Test that it all works:**

1. Click **Create an account** and sign up with a real email address.
2. Check your inbox — Supabase sends a confirmation link. Click it. (Check your spam folder if it isn't there in a minute.)
3. You should land on the dashboard.
4. Click **Sign out**, then try going to `http://localhost:3000/dashboard` directly. It should kick you back to the login page. That means the route protection works.

**To stop the app:** click on the terminal window and press `Ctrl + C`.

---

## 8. Push the code to GitHub

First, tell Git who you are. Do this once, ever. Use your real GitHub email:

```
git config --global user.name "Your Name"
```

```
git config --global user.email "you@example.com"
```

### Create an empty repository on GitHub

1. Go to https://github.com/new
2. **Repository name:** `leadflow`
3. **Private** (recommended)
4. **Do not** tick "Add a README file", ".gitignore" or "license" — leave all three unticked.
5. Click **Create repository**.
6. On the next page, copy the URL it shows you. It looks like `https://github.com/yourname/leadflow.git`.

### Upload the code

Back in your terminal, still inside the `leadflow` folder, type these one at a time:

```
git init
```

```
git add .
```

```
git commit -m "Phase 1: auth, database and dashboard shell"
```

```
git branch -M main
```

Now paste in your own URL from GitHub (replace `yourname`):

```
git remote add origin https://github.com/yourname/leadflow.git
```

```
git push -u origin main
```

A browser window or a popup will ask you to sign in to GitHub. Do that, and the upload finishes.

Refresh your GitHub page — the files should be there. Check that `.env.local` is **not** in the list. If you can see it, stop and tell me, because your keys are exposed.

---

## 9. Deploy to Vercel for free

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New → Project**.
3. Find `leadflow` in the list and click **Import**. If you don't see it, click **Adjust GitHub App Permissions** and give Vercel access to the repo.
4. Leave Framework Preset as **Next.js** and don't touch the build settings.
5. Open the **Environment Variables** section and add these five, one at a time (Name on the left, Value on the right, then **Add**):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
| `GOOGLE_PLACES_API_KEY` | your Google Places key |
| `NEXT_PUBLIC_SITE_URL` | leave for now — you'll set it in a moment |

For `NEXT_PUBLIC_SITE_URL`, put `https://leadflow.vercel.app` as a first guess; you'll correct it in the next step once you know the real address.

6. Click **Deploy** and wait about a minute.
7. Vercel gives you a live URL like `https://leadflow-xyz123.vercel.app`. **Copy it.**

### Fix the site URL

1. In Vercel, go to your project → **Settings** → **Environment Variables**.
2. Edit `NEXT_PUBLIC_SITE_URL` and set it to your real Vercel URL (no slash at the end).
3. Go to the **Deployments** tab, click the `...` menu on the newest deployment, and choose **Redeploy**.

---

## 10. Tell Supabase about your live URL (important)

Without this, the confirmation and password-reset emails will point at `localhost` and break for everyone.

1. In Supabase: **Authentication** → **URL Configuration**.
2. **Site URL:** your Vercel URL, e.g. `https://leadflow-xyz123.vercel.app`
3. **Redirect URLs:** click **Add URL** and add both of these:

```
https://leadflow-xyz123.vercel.app/auth/callback
```

```
http://localhost:3000/auth/callback
```

4. Click **Save**.

Keeping the `localhost` one means the app still works when you're developing on your own computer.

Now open your live URL, sign up with a second email, and confirm you land on the dashboard.

---

## 11. Connect a custom domain

You need to own a domain first. Buy one from Namecheap, Cloudflare, GoDaddy, or Vercel itself (Vercel's own is the least fiddly, because it skips the DNS step).

### In Vercel

1. Your project → **Settings** → **Domains**.
2. Type your domain, e.g. `app.yourdomain.com`, and click **Add**.
3. Vercel shows you a DNS record to create. It'll be one of these:

| If you're adding | Record type | Name | Value |
|---|---|---|---|
| `app.yourdomain.com` (a subdomain) | `CNAME` | `app` | `cname.vercel-dns.com` |
| `yourdomain.com` (the root) | `A` | `@` | `76.76.21.21` |

Use whatever Vercel shows on your screen — it's the authority, not this table.

### At your domain registrar

1. Log in to wherever you bought the domain.
2. Find **DNS**, **DNS Settings**, or **Manage DNS**.
3. Click **Add record** and enter exactly what Vercel told you.
4. Save.

Go back to Vercel. The domain shows **Invalid Configuration** at first — that's normal. It usually turns to **Valid** within 10–30 minutes (occasionally up to 48 hours). Vercel sets up the HTTPS certificate for you automatically.

### Then update these two things

1. **Vercel** → Settings → Environment Variables → set `NEXT_PUBLIC_SITE_URL` to `https://app.yourdomain.com`, then redeploy.
2. **Supabase** → Authentication → URL Configuration → change **Site URL** to `https://app.yourdomain.com` and add `https://app.yourdomain.com/auth/callback` to the Redirect URLs.

Skip these and logins will still work, but the emails will send people to the old address.

---

## 12. Everyday commands

Once set up, this is your whole routine.

**To work on the app locally:**

```
cd Desktop/leadflow
```

```
npm run dev
```

**To save your changes and push them live** (Vercel redeploys automatically on every push):

```
git add .
```

```
git commit -m "describe what you changed"
```

```
git push
```

**To check for errors before pushing:**

```
npm run build
```

---

## 13. If something goes wrong

| What you see | What it means | Fix |
|---|---|---|
| `command not found: npm` | Node.js isn't installed, or the terminal was open before you installed it | Install Node.js, close the terminal, open a new one |
| `Your project's URL and API key are required` | `.env.local` is missing or misspelled | Check the file is named exactly `.env.local` and sits in the `leadflow` folder, not inside `src`. Restart `npm run dev` after editing it |
| `Invalid login credentials` | Wrong password, or you never clicked the confirmation email | Check your inbox and spam folder |
| Confirmation email never arrives | Supabase's free built-in email sender is rate-limited and lands in spam a lot | Check spam. For testing you can turn off **Confirm email** at Authentication → Providers → Email. Turn it back on before real users sign up |
| Email link sends you to `localhost` when live | `Site URL` is still the local one | Redo step 10 |
| `Port 3000 is already in use` | The app is already running in another terminal | Close the other terminal, or run `npm run dev -- -p 3001` |
| Dashboard loads for a logged-out user | Middleware isn't running | Check `middleware.ts` is at the top level of the project, not inside `src` |
| Vercel build fails | Usually a missing environment variable | Open the failed deployment in Vercel and read the red text at the bottom of the log |
| Find Leads says *"Search isn't configured yet"* | `GOOGLE_PLACES_API_KEY` is missing | Add it to `.env.local` (or to Vercel's environment variables), then restart the app / redeploy |
| *"Google rejected the API key"* | The Places API (New) isn't enabled, or the key restrictions block it | Section 5: enable **Places API (New)**, and set API restrictions to that API only |
| *"billing isn't enabled"* | No card linked to the Google Cloud project | Section 5, "Turn on billing". Required even for free usage |
| *"You've hit Google's search limit for now"* | Too many searches too fast, or your daily quota cap is used up | Wait a minute. If it persists, check **APIs & Services → Places API → Quotas** |
| *"Couldn't reach Google"* | Your internet dropped, or Google is down | Try again; the search terms stay in the form |
| *"No businesses matched that search"* | The category is too specific | Use what businesses call themselves — `dentist` works where `cosmetic dental clinic` often doesn't |
| Adding a lead says *"Already in your leads"* | You've saved that exact business before | Working as intended — open **Leads** and search for it |
| Lead page shows **Lead not found** | Wrong link, or that lead belongs to another account | Go back to **Leads** and click through from the list |
| `column leads.provider_place_id does not exist` | Migration `0002` hasn't been run | Section 4 — run `0002_provider_place_id.sql` in the Supabase SQL Editor |
| Audit says *"This site was audited moments ago"* | The 60-second per-lead cooldown | Wait it out. It stops you hammering someone else's website |
| Audit says *"You've run 10 audits in the last 5 minutes"* | The per-user burst limit | Wait a few minutes. Both limits are in `src/lib/audit/rate-limit.ts` if you want to change them |
| Audit says *"blocks automated requests"* | The site returned 403/401/429 to our request | Nothing to fix — plenty of sites block bots. Open it yourself and judge it by hand |
| Most findings say *"Could not verify"* | The site builds its content with JavaScript | Expected. See section 14 — the audit reads HTML, it doesn't run a browser |
| Audit gives a high score to a site that looks fine | The score measures fixable problems, not quality | Read the reasons list under the score; if a weight feels wrong, edit `SCORING_CONFIG` in `src/lib/audit/scoring.ts` |

### How search errors and rate limits behave

The app never shows a blank page or a crash screen when a search goes wrong. Every failure resolves to a sentence on screen explaining what happened and whether retrying will help:

| Situation | What you see | Retrying helps? |
|---|---|---|
| Missing API key | "Search isn't configured yet…" | No — fix the environment variable |
| Key rejected / billing off | "Google rejected the API key…" | No — fix it in Google Cloud Console |
| Quota or rate limit (HTTP 429) | "You've hit Google's search limit for now…" | Yes, after a short wait |
| Google server error (HTTP 5xx) | "Google's search service is having trouble…" | Yes |
| No internet | "Couldn't reach Google…" | Yes |
| Query Google can't parse (HTTP 400) | "Google couldn't understand that search…" | Yes, with simpler terms |
| Zero matches | An empty state suggesting broader terms | Yes, with different terms |

Three things keep your Google bill down without you doing anything:

- **Identical searches are cached for 5 minutes.** Refreshing the page, or running the same niche and city twice in a row, doesn't cost a second API call.
- **Only the fields the app displays are requested.** Google bills partly by which fields you ask for, so the request asks for name, address, website, rating, category and phone, and nothing else.
- **Each search returns at most 20 businesses**, which is one billable request.

Your own daily quota cap (section 5) is the hard backstop. When it's reached, searching stops and the rate-limit message appears until the quota resets.

After changing anything in `.env.local`, always stop the app (`Ctrl + C`) and run `npm run dev` again. It only reads that file on startup.

---

## 14. How the website audit works

Open any lead and press **Run audit**. It fetches the business's homepage once, reads the HTML, and reports what it finds. It takes a few seconds.

### It costs nothing

This phase makes **no paid API calls at all**. It's a plain HTTP request plus HTML parsing — no headless browser, no scraping service, no Google quota, no Anthropic credit. You can audit every lead you have and the bill stays zero.

`ANTHROPIC_API_KEY` is still unused. **Phase 4 (AI demo generation) is the first phase that needs it.**

The one package added is [`node-html-parser`](https://www.npmjs.com/package/node-html-parser) — MIT licensed, free, no paid tier, no account. It was chosen over the alternatives on purpose: Cheerio pulls in a much larger dependency tree, and JSDOM tries to emulate a whole browser, which is slow and heavy for what amounts to "find the title tag". `node-html-parser` does the one job.

### What it checks

| Check | What counts as a problem |
|---|---|
| **Site loads** | No response over https or http, an error page, or a redirect loop |
| **Server response time** | Over 1.5s is a warning, over 3.5s is critical |
| **HTTPS** | No working certificate, or http that doesn't redirect to https |
| **Mobile layout** | No viewport meta tag, or one that doesn't set `width=device-width` |
| **Page title** | Missing, very short, or too long for a search result |
| **Meta description** | Missing or too short to sell the click |
| **Main heading** | No H1, or several competing H1s |
| **Call to action** | No link or button matching common action phrases |
| **Contact details** | No phone, email, form or contact page findable on the homepage |

Every finding gets a severity — **Critical**, **Warning**, **Good**, or **Could not verify** — and, where there's a problem, one practical sentence on how to fix it.

### What it deliberately cannot tell you

This is the important part. The audit reads the HTML a server sends. It does not run a browser, so anything that only exists after JavaScript executes is invisible to it. Rather than guess, those checks report **"Could not verify"** and are **excluded from the score entirely** — they're not counted as passes or failures.

Specifically, it can't tell you:

- **Real page load speed.** It records how long the server took to answer the first request. That's a genuine signal, but it isn't what a visitor experiences — images, fonts, scripts and render time aren't measured. The findings list says so explicitly.
- **Whether the site actually looks right on a phone.** A viewport tag is a signal of intent, not proof. A site can have the tag and still be unusable on mobile.
- **Anything on a JavaScript-rendered site.** If a site is built as a React/Vue/Next app that ships an empty shell, the headings, buttons and contact details aren't in the HTML we receive. The audit detects this and marks those checks unverified instead of reporting false problems.
- **Anything on a site that blocks bots.** A 403 means the server is alive but refusing us. The audit says so and caps the score, rather than pretending the site is broken.
- **Design quality, copy quality, or whether the business is any good.** Nothing here reads like a human would.

The call-to-action check is explicitly a **best-effort heuristic**: it scans link and button text for common phrases like "contact", "book" or "get a quote". An unusually worded button will be missed. The finding says this on screen, so you don't take it as fact.

### How the score works

The **Opportunity score** runs 0–100. Higher means more is wrong with the site that you could fix.

It is **not** a probability of making a sale, and it is never labelled as one. Plenty of businesses with terrible websites have no budget; plenty with good websites still want help. The score ranks where the visible work is, nothing more.

Each check carries a weight. A critical finding awards the full weight, a warning awards half, a good finding awards nothing. The score is the share of *assessable* points awarded — checks that couldn't be verified are left out of both the top and bottom of that fraction, so an unreadable site can't quietly score as a perfect one.

All the weights live in one object, `SCORING_CONFIG` in `src/lib/audit/scoring.ts`:

```ts
weights: {
  https: 12,  viewport: 15,  contact: 14,  cta: 12,
  title: 11,  h1: 8,  meta_description: 8,  response_time: 10,
}
```

Change a number there and every future score shifts. No other file needs touching. The same object holds the warning multiplier, the score given to a site that doesn't load at all, the cap applied when a site blocks us, and the high/medium/low boundaries.

The score panel lists every point that was awarded and why, so you can always see where a number came from. When a lot couldn't be verified, it says so above the reasons.

### What happens to the lead

After a successful audit, a lead sitting at **New** moves to **Audited** automatically. A lead you've already moved on yourself — Qualified, Contacted, Won — is left where you put it.

**Marking a lead Qualified is your decision, not the app's.** Read the score and the findings, then change the status on the lead page. The audit never qualifies anything for you.

### Being polite about it

You're fetching somebody else's website, so there are two limits, both in `src/lib/audit/rate-limit.ts`:

- **60 seconds** between audits of the same lead.
- **10 audits per user per 5 minutes** across all leads.

There's also a **9-second timeout** on the fetch, so one dead site can't hang the page, and a 1.5 MB cap on how much HTML is read. Requests identify themselves honestly in the User-Agent rather than pretending to be a person.

One security note: the fetcher refuses to request `localhost`, private IP ranges, and cloud metadata addresses. Without that, saving `http://169.254.169.254` as a lead's website would make your own server fetch its own internal credentials. The block works on hostnames and IP literals; a public domain deliberately pointed at a private IP would still get through, which is a known limitation rather than an oversight.

---

## 15. What's in this project

```
leadflow/
├── middleware.ts                  Blocks logged-out users from /dashboard
├── .env.example                   Template for your keys
├── supabase/
│   └── migrations/
│       ├── 0001_init.sql          The leads table + security policies
│       └── 0002_provider_place_id.sql   Duplicate prevention (Phase 2)
└── src/
    ├── app/
    │   ├── page.tsx               Landing page
    │   ├── layout.tsx             Wraps every page
    │   ├── globals.css            Tailwind setup
    │   ├── (auth)/
    │   │   ├── actions.ts         Signup, login, reset, logout logic
    │   │   ├── login/
    │   │   ├── signup/
    │   │   ├── forgot-password/   Request a reset link
    │   │   └── update-password/   Set the new password
    │   ├── auth/
    │   │   ├── callback/          Handles links from Supabase emails
    │   │   └── signout/
    │   └── dashboard/
    │       ├── layout.tsx         Sidebar + page frame
    │       ├── page.tsx           Stat cards
    │       ├── find-leads/        Google Places search + save
    │       ├── leads/             Your list, filters, pagination
    │       │   └── [id]/          One lead: notes, status, audit, score, delete
    │       ├── audits/  demos/  outreach/  followups/  settings/
    │       └── */loading.tsx      Loading states
    ├── components/                Sidebar, forms, badges, pagination
    ├── lib/
    │   ├── places.ts              Google Places search + error handling
    │   ├── audit/                 Website audit engine (Phase 3)
    │   │   ├── index.ts           Runs an audit end to end
    │   │   ├── fetch-site.ts      Safe fetch: timeout, https probe, SSRF guard
    │   │   ├── checks.ts          The individual checks and findings
    │   │   ├── scoring.ts         SCORING_CONFIG — tune the weights here
    │   │   ├── rate-limit.ts      Per-lead cooldown + per-user burst limit
    │   │   └── types.ts           Shapes stored in the jsonb columns
    │   └── supabase/
    │       ├── client.ts          For browser code
    │       ├── server.ts          For server code
    │       └── middleware.ts      Session refresh + route guarding
    └── types/database.ts          TypeScript types for a lead
```

### How your data is kept private

Three separate locks, so a mistake in one doesn't expose anything:

1. **Row Level Security in Postgres.** Every read, insert, update and delete on `leads` is filtered by `auth.uid() = user_id`. This runs inside the database, so it holds even if someone bypasses the app entirely and calls the API by hand with the public key. `user_id` also can't be changed after a row is created.
2. **Middleware.** Every request to `/dashboard/*` is checked with `supabase.auth.getUser()`, which revalidates the token against Supabase rather than trusting the cookie.
3. **A second check in the dashboard layout**, in case the middleware matcher is ever edited by accident.

### What's deliberately not built yet

Demos, Outreach and Follow-ups are still empty shells, and the matching sections on a lead's page read "Not run yet". The database columns they need (`demo_status`, `demo_url`, `outreach_status`, `followup_status`) already exist, so Phase 4 won't need another migration either.

The Demos, Contacted and Follow-ups stat cards on the dashboard read from real data, so they'll stay at zero until Phase 4 gives them something to count.
