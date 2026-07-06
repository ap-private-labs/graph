const { edges, papers } = window.GRAPH_DATA;

const svg = document.querySelector("#graph");
const detail = document.querySelector("#paper-detail");
const paperGrid = document.querySelector("#papers");
const areaFilters = document.querySelector("#area-filters");
const legend = document.querySelector("#legend");
const search = document.querySelector("#search");
const visibleCount = document.querySelector("#visible-count");
const paperCount = document.querySelector("#paper-count");
const edgeCount = document.querySelector("#edge-count");

const colorByArea = new Map([
  ["Image-based rendering", "#c44f3a"],
  ["Internet photo collections", "#217c7e"],
  ["Camera geometry", "#5e7f38"],
  ["Implicit geometry", "#7662a8"],
  ["Neural scene fields", "#aa5b91"],
  ["Neural rendering", "#c08a24"],
  ["Coordinate networks", "#516fb4"],
  ["Neural radiance fields", "#111827"],
  ["Unconstrained capture", "#2f8f66"],
  ["Generalizable NeRF", "#d17634"],
  ["Anti-aliasing", "#3887a6"],
  ["Real-time rendering", "#bf3f59"],
  ["Explicit radiance fields", "#7b6b2c"],
  ["Acceleration", "#476f6f"],
  ["Unbounded scenes", "#6c5d99"],
  ["Compact explicit fields", "#9b5b44"]
]);

const paperById = new Map(papers.map((paper) => [paper.id, paper]));
const incoming = new Map(papers.map((paper) => [paper.id, []]));
const outgoing = new Map(papers.map((paper) => [paper.id, []]));

edges.forEach((edge) => {
  outgoing.get(edge.source).push(edge);
  incoming.get(edge.target).push(edge);
});

let selectedId = "nerf";
let selectedArea = "All";
let query = "";

paperCount.textContent = String(papers.length);
edgeCount.textContent = String(edges.length);

function areas() {
  return ["All", ...Array.from(new Set(papers.map((paper) => paper.area))).sort()];
}

function visiblePapers() {
  const lowerQuery = query.trim().toLowerCase();
  return papers.filter((paper) => {
    const areaMatches = selectedArea === "All" || paper.area === selectedArea;
    const text = `${paper.title} ${paper.year} ${paper.venue} ${paper.authors.join(" ")} ${paper.area}`.toLowerCase();
    return areaMatches && (!lowerQuery || text.includes(lowerQuery));
  });
}

function layout(width, height) {
  const margin = { top: 46, right: 58, bottom: 48, left: 66 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const years = papers.map((paper) => paper.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearSpan = maxYear - minYear || 1;
  const yearCounts = new Map();
  const points = new Map();

  papers
    .slice()
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
    .forEach((paper) => {
      const indexForYear = yearCounts.get(paper.year) ?? 0;
      yearCounts.set(paper.year, indexForYear + 1);
      const x = margin.left + ((paper.year - minYear) / yearSpan) * innerWidth;
      const yearTotal = papers.filter((candidate) => candidate.year === paper.year).length;
      const spread = Math.min(260, Math.max(0, (yearTotal - 1) * 58));
      const y = margin.top + innerHeight / 2 - spread / 2 + indexForYear * 58;
      points.set(paper.id, { x, y });
    });

  return { margin, minYear, maxYear, points, width, height };
}

function makeSvg(name, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function edgePath(source, target) {
  const dx = Math.max(80, Math.abs(target.x - source.x) * 0.46);
  return `M ${source.x} ${source.y} C ${source.x + dx} ${source.y}, ${target.x - dx} ${target.y}, ${target.x} ${target.y}`;
}

function edgeIsActive(edge) {
  return edge.source === selectedId || edge.target === selectedId;
}

function renderGraph() {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(720, Math.round(rect.width || 920));
  const height = Math.max(620, Math.round(rect.height || 660));
  const state = layout(width, height);
  const visibleIds = new Set(visiblePapers().map((paper) => paper.id));

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();

  const defs = makeSvg("defs");
  const marker = makeSvg("marker", {
    id: "arrow",
    viewBox: "0 0 10 10",
    refX: "8",
    refY: "5",
    markerWidth: "6",
    markerHeight: "6",
    orient: "auto-start-reverse"
  });
  marker.append(makeSvg("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "rgba(24,33,47,0.45)" }));
  defs.append(marker);
  svg.append(defs);

  const yearLayer = makeSvg("g");
  const shownYears = [1996, 2006, 2016, 2019, 2020, 2021, 2022, 2023];
  shownYears.forEach((year) => {
    const x = state.margin.left + ((year - state.minYear) / (state.maxYear - state.minYear)) * (width - state.margin.left - state.margin.right);
    yearLayer.append(makeSvg("line", { class: "year-line", x1: x, x2: x, y1: 28, y2: height - 32 }));
    const label = makeSvg("text", { class: "year-label", x, y: height - 18, "text-anchor": "middle" });
    label.textContent = String(year);
    yearLayer.append(label);
  });
  svg.append(yearLayer);

  const edgeLayer = makeSvg("g");
  edges.forEach((edge) => {
    const source = state.points.get(edge.source);
    const target = state.points.get(edge.target);
    const active = edgeIsActive(edge);
    const hiddenByFilter = !visibleIds.has(edge.source) || !visibleIds.has(edge.target);
    const path = makeSvg("path", {
      class: `edge ${active ? "active" : ""} ${hiddenByFilter ? "dimmed" : ""}`,
      d: edgePath(source, target),
      "marker-end": "url(#arrow)"
    });
    edgeLayer.append(path);
  });
  svg.append(edgeLayer);

  const nodeLayer = makeSvg("g");
  papers.forEach((paper) => {
    const point = state.points.get(paper.id);
    const active = paper.id === selectedId;
    const filtered = !visibleIds.has(paper.id);
    const group = makeSvg("g", {
      class: `node-group ${active ? "active" : ""} ${filtered ? "dimmed" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": paper.title
    });
    group.addEventListener("click", () => selectPaper(paper.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPaper(paper.id);
      }
    });

    group.append(makeSvg("circle", {
      class: "node-ring",
      cx: point.x,
      cy: point.y,
      r: 18
    }));
    group.append(makeSvg("circle", {
      class: "node",
      cx: point.x,
      cy: point.y,
      r: active ? 13 : 10,
      fill: colorByArea.get(paper.area) || "#18212f"
    }));

    const title = shortTitle(paper.title);
    const labelX = point.x + 14;
    const labelY = point.y - 15;
    const labelWidth = Math.min(178, Math.max(76, title.length * 6.2));
    group.append(makeSvg("rect", {
      class: "node-label-bg",
      x: labelX - 5,
      y: labelY - 14,
      width: labelWidth,
      height: 20,
      rx: 5
    }));
    const label = makeSvg("text", {
      class: "node-label",
      x: labelX,
      y: labelY,
      "text-anchor": "start"
    });
    label.textContent = title;
    group.append(label);
    nodeLayer.append(group);
  });
  svg.append(nodeLayer);
}

function shortTitle(title) {
  const aliases = new Map([
    ["Light Field Rendering", "Light Field Rendering"],
    ["The Lumigraph", "Lumigraph"],
    ["Photo Tourism: Exploring Photo Collections in 3D", "Photo Tourism"],
    ["Structure-from-Motion Revisited", "COLMAP / SfM"],
    ["Occupancy Networks: Learning 3D Reconstruction in Function Space", "Occupancy Networks"],
    ["DeepSDF: Learning Continuous Signed Distance Functions for Shape Representation", "DeepSDF"],
    ["Scene Representation Networks", "SRN"],
    ["Neural Volumes: Learning Dynamic Renderable Volumes from Images", "Neural Volumes"],
    ["Fourier Features Let Networks Learn High Frequency Functions in Low Dimensional Domains", "Fourier Features"],
    ["NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis", "NeRF"],
    ["NeRF in the Wild: Neural Radiance Fields for Unconstrained Photo Collections", "NeRF-W"],
    ["pixelNeRF: Neural Radiance Fields from One or Few Images", "pixelNeRF"],
    ["Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields", "Mip-NeRF"],
    ["PlenOctrees for Real-time Rendering of Neural Radiance Fields", "PlenOctrees"],
    ["KiloNeRF: Speeding up Neural Radiance Fields with Thousands of Tiny MLPs", "KiloNeRF"],
    ["Plenoxels: Radiance Fields without Neural Networks", "Plenoxels"],
    ["Instant Neural Graphics Primitives with a Multiresolution Hash Encoding", "Instant-NGP"],
    ["Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields", "Mip-NeRF 360"],
    ["TensoRF: Tensorial Radiance Fields", "TensoRF"],
    ["3D Gaussian Splatting for Real-Time Radiance Field Rendering", "3D Gaussian Splatting"]
  ]);
  return aliases.get(title) || title;
}

function renderFilters() {
  areaFilters.replaceChildren();
  areas().forEach((area) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.textContent = area;
    button.setAttribute("aria-pressed", String(area === selectedArea));
    button.addEventListener("click", () => {
      selectedArea = area;
      render();
    });
    areaFilters.append(button);
  });

  legend.replaceChildren();
  Array.from(colorByArea.entries()).forEach(([area, color]) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="dot" style="--dot: ${color}"></span><span>${area}</span>`;
    legend.append(item);
  });
}

function renderDetails() {
  const paper = paperById.get(selectedId);
  const paperCites = incoming.get(selectedId);
  const citedByPaper = outgoing.get(selectedId);

  detail.innerHTML = `
    <div class="detail-kicker">${paper.year} / ${paper.venue}</div>
    <h2 class="detail-title">${paper.title}</h2>
    <div class="meta">
      <span class="pill">${paper.area}</span>
      <span class="pill">${paper.citationBand} citations</span>
      <span class="pill">${paper.authors.length} authors</span>
    </div>
    <p>${paper.contribution}</p>
    <p><strong>Authors:</strong> ${paper.authors.join(", ")}</p>
    ${relationList("Cites earlier work", paperCites, "source")}
    ${relationList("Cited by later work", citedByPaper, "target")}
    <a class="detail-link" href="${paper.url}" target="_blank" rel="noreferrer">Paper source</a>
  `;
}

function relationList(title, relationEdges, otherSide) {
  if (!relationEdges.length) {
    return "";
  }

  const items = relationEdges
    .map((edge) => {
      const other = paperById.get(edge[otherSide]);
      return `<li><strong>${shortTitle(other.title)}</strong>: ${edge.relation}</li>`;
    })
    .join("");

  return `<h3>${title}</h3><ul class="relation-list">${items}</ul>`;
}

function renderPaperCards() {
  const visible = visiblePapers();
  visibleCount.textContent = `${visible.length} shown`;
  paperGrid.replaceChildren();

  visible
    .slice()
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
    .forEach((paper) => {
      const card = document.createElement("article");
      card.className = "paper-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-current", String(paper.id === selectedId));
      card.innerHTML = `
        <span class="pill">${paper.year} / ${paper.venue}</span>
        <h3>${paper.title}</h3>
        <p>${paper.area} / ${paper.citationBand} citations</p>
      `;
      card.addEventListener("click", () => selectPaper(paper.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPaper(paper.id);
        }
      });
      paperGrid.append(card);
    });
}

function selectPaper(id) {
  selectedId = id;
  renderGraph();
  renderDetails();
  renderPaperCards();
}

function render() {
  renderFilters();
  renderGraph();
  renderDetails();
  renderPaperCards();
}

search.addEventListener("input", (event) => {
  query = event.target.value;
  renderGraph();
  renderPaperCards();
});

window.addEventListener("resize", () => {
  window.requestAnimationFrame(renderGraph);
});

render();
