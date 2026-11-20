# Vighas K S: DevSecOps Portfolio

Live site: **https://vighas-portfolio.netlify.app**

Multi-page portfolio built with plain HTML, CSS and JavaScript (no framework, no build step). Content is edited through a Git-based CMS at **/admin**, and Netlify redeploys automatically on every commit.

## How it works

```
You edit in /admin  →  Sveltia CMS commits content/*.json to GitHub  →  Netlify redeploys (~1 min)
```

## Structure

```
├── index.html, about.html, experience.html,
│   skills.html, certifications.html, contact.html, 404.html
├── content/                 ← ALL SITE CONTENT (edited via /admin)
│   ├── profile.json           name, roles, hero text, photo, resume & social links
│   ├── home.json              stats, pillars, featured work, tech strip
│   ├── about.json             summary, principles, education
│   ├── experience.json        jobs → sections → achievements
│   ├── skills.json            skill categories, pipeline steps
│   ├── certifications.json    certificates and badges
│   ├── site.json              menu names, footer, small labels, colours & theme
│   └── pages/*.json           each page's headings, buttons, form labels, terminal
│                              lines, browser tab title and Google description
├── admin/
│   ├── index.html           Sveltia CMS app
│   └── config.yml           Admin forms (fields for every content file)
├── assets/
│   ├── css/style.css        Design, themes, animations
│   ├── js/main.js           Loads content/*.json and renders every page
│   └── img/                 Photo, badges, favicon (uploads go to img/uploads/)
└── netlify.toml             Netlify settings and security headers
```

## Editing content

1. Go to https://vighas-portfolio.netlify.app/admin
2. Sign in with GitHub
3. Edit a section and click **Save**. The change goes live in about a minute.

Every save is a Git commit, so the full history is in this repository and any change can be rolled back.

Text formatting in /admin: `*word*` gives a word the gradient colour (or the highlight colour in terminal lines) and `**word**` makes it bold.

## Run locally

The pages load `content/*.json`, so they must be served over HTTP (double-clicking the HTML files won't work):

```
python -m http.server 8000
```

Then open http://localhost:8000. To edit content locally, open http://localhost:8000/admin/ in Chrome or Edge and choose **Work with Local Repository**.

## Tech

HTML · CSS · Vanilla JavaScript · Sveltia CMS · Netlify (hosting, Forms, security headers) · GitHub
