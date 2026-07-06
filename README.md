# NeRF Citation Graph

A static website that shows a citation-based knowledge graph for influential NeRF and neural rendering papers.

The site is plain HTML, CSS, and JavaScript. It does not need a build step, so GitHub Pages can serve it directly. It also works by opening `index.html` directly in a browser.

## Included Scope

- 20 papers from 1996 to 2023
- Each paper has a citation band above a 50-citation floor
- Directed edges represent earlier papers cited by later papers
- Metadata includes title, authors, venue, year, area, citation band, contribution, and source URL

## Local Preview

Open `index.html` directly in a browser, or run a static server from the repo root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy To GitHub Pages

1. Push this repo to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main`; the included workflow publishes the site.

## Editing The Graph

Paper metadata and citation edges live in `data/papers.js`.

Add a paper to `papers`, then add citation relationships to `edges`:

```js
{
  source: "earlier-paper-id",
  target: "later-paper-id",
  relation: "cited for ..."
}
```
