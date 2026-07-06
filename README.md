# AI Works Knowledge Graph

A static website that shows citation-based knowledge graphs for influential AI research lineages.

The site is plain HTML, CSS, and JavaScript. It does not need a build step, so GitHub Pages can serve it directly. It also works by opening `index.html` directly in a browser.

## Included Scope

- Topic tabs for NeRF, video diffusion models, and inverse problems with diffusion models
- NeRF starts at 2020, video diffusion starts at 2022, and inverse-problem diffusion starts at 2019
- Each paper has a citation band above a 50-citation floor
- Directed edges represent cited work leading into later citing work
- Metadata includes title, authors, venue, year, area, citation band, contribution, and source URL
- The main graph supports drag panning, scroll zooming, zoom buttons, and clickable paper nodes

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

Add a paper to a topic's `papers`, then add citation relationships to that topic's `edges`:

```js
["earlier-paper-id", "later-paper-id", "cited for ..."]
```
