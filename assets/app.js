const { topics } = window.GRAPH_DATA;

const topicTabs = document.querySelector("#topic-tabs");
const graph = document.querySelector("#graph");
const detail = document.querySelector("#paper-detail");
const graphTitle = document.querySelector("#graph-title");
const graphSummary = document.querySelector("#graph-summary");
const graphMeta = document.querySelector("#graph-meta");
const zoomIn = document.querySelector("#zoom-in");
const zoomOut = document.querySelector("#zoom-out");
const zoomReset = document.querySelector("#zoom-reset");

const colors = [
  "#be4a3d",
  "#207b7f",
  "#6b5ca5",
  "#b87922",
  "#507339",
  "#aa4f7d",
  "#456db3",
  "#8a6237",
  "#d16a32",
  "#48706b"
];

let activeTopicId = topics[0].id;
let selectedId = topics[0].papers.find((paper) => paper.title.includes("NeRF"))?.id || topics[0].papers[0].id;
let transform = { x: 0, y: 0, scale: 1 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragOrigin = { x: 0, y: 0 };

function activeTopic() {
  return topics.find((topic) => topic.id === activeTopicId);
}

function activePaper() {
  return activeTopic().papers.find((paper) => paper.id === selectedId) || activeTopic().papers[0];
}

function makeSvg(name, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function paperMap(topic) {
  return new Map(topic.papers.map((paper) => [paper.id, paper]));
}

function relationMaps(topic) {
  const incoming = new Map(topic.papers.map((paper) => [paper.id, []]));
  const outgoing = new Map(topic.papers.map((paper) => [paper.id, []]));
  topic.edges.forEach(([source, target, relation]) => {
    const edge = { source, target, relation };
    outgoing.get(source)?.push(edge);
    incoming.get(target)?.push(edge);
  });
  return { incoming, outgoing };
}

function areaColors(topic) {
  const areas = Array.from(new Set(topic.papers.map((paper) => paper.area)));
  return new Map(areas.map((area, index) => [area, colors[index % colors.length]]));
}

function layout(topic, width, height) {
  const margin = { top: 70, right: 110, bottom: 76, left: 110 };
  const years = topic.papers.map((paper) => paper.year);
  const minYear = 2019;
  const maxYear = Math.max(...years);
  const yearSpan = Math.max(1, maxYear - minYear);
  const grouped = new Map();
  const points = new Map();

  topic.papers
    .slice()
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
    .forEach((paper) => {
      const bucket = grouped.get(paper.year) || [];
      bucket.push(paper);
      grouped.set(paper.year, bucket);
    });

  grouped.forEach((papersForYear, year) => {
    const x = margin.left + ((year - minYear) / yearSpan) * (width - margin.left - margin.right);
    const usable = height - margin.top - margin.bottom;
    const step = Math.min(88, usable / Math.max(1, papersForYear.length));
    const start = margin.top + usable / 2 - ((papersForYear.length - 1) * step) / 2;
    papersForYear.forEach((paper, index) => {
      const jitter = index % 2 === 0 ? -10 : 10;
      points.set(paper.id, { x: x + jitter, y: start + index * step });
    });
  });

  return { margin, minYear, maxYear, points };
}

function shortTitle(title) {
  const aliases = [
    ["Occupancy Networks", "Occupancy Nets"],
    ["DeepSDF", "DeepSDF"],
    ["Scene Representation Networks", "SRN"],
    ["Neural Volumes", "Neural Volumes"],
    ["NeRF:", "NeRF"],
    ["Fourier Features", "Fourier Features"],
    ["NeRF in the Wild", "NeRF-W"],
    ["pixelNeRF", "pixelNeRF"],
    ["Mip-NeRF:", "Mip-NeRF"],
    ["PlenOctrees", "PlenOctrees"],
    ["KiloNeRF", "KiloNeRF"],
    ["Plenoxels", "Plenoxels"],
    ["Instant Neural Graphics", "Instant-NGP"],
    ["Mip-NeRF 360", "Mip-NeRF 360"],
    ["TensoRF", "TensoRF"],
    ["Direct Voxel", "DVGO"],
    ["Zip-NeRF", "Zip-NeRF"],
    ["3D Gaussian", "3D Gaussian Splatting"],
    ["Generative Modeling by Estimating", "NCSN"],
    ["Denoising Diffusion Probabilistic", "DDPM"],
    ["Score-Based Generative", "Score SDE"],
    ["Classifier-Free", "CFG"],
    ["Video Diffusion Models", "Video Diffusion"],
    ["Masked Conditional", "MCVD"],
    ["Make-A-Video", "Make-A-Video"],
    ["Imagen Video", "Imagen Video"],
    ["Phenaki", "Phenaki"],
    ["Tune-A-Video", "Tune-A-Video"],
    ["Text2Video-Zero", "Text2Video-Zero"],
    ["Align your Latents", "Video LDM"],
    ["ModelScope", "ModelScope"],
    ["AnimateDiff", "AnimateDiff"],
    ["Stable Video Diffusion", "SVD"],
    ["VideoPoet", "VideoPoet"],
    ["Lumiere", "Lumiere"],
    ["Solving Inverse Problems in Medical Imaging", "Score-MRI"],
    ["ILVR", "ILVR"],
    ["RePaint", "RePaint"],
    ["Palette", "Palette"],
    ["Solving Linear Inverse Problems", "Denoiser Prior"],
    ["Denoising Diffusion Restoration", "DDRM"],
    ["Diffusion Posterior Sampling", "DPS"],
    ["Manifold Constraints", "MCG"],
    ["Null-Space Model", "DDNM"],
    ["Pseudoinverse-Guided", "PiGDM"],
    ["DiffPIR", "DiffPIR"],
    ["RED-Diff", "RED-Diff"],
    ["BlindDPS", "BlindDPS"],
    ["DMPlug", "DMPlug"]
  ];
  const match = aliases.find(([prefix]) => title.startsWith(prefix) || title.includes(prefix));
  return match ? match[1] : title.split(":")[0];
}

function edgePath(source, target) {
  const dx = Math.max(70, Math.abs(target.x - source.x) * 0.42);
  const verticalBend = Math.sign(target.y - source.y || 1) * 8;
  return `M ${source.x} ${source.y} C ${source.x + dx} ${source.y + verticalBend}, ${target.x - dx} ${target.y - verticalBend}, ${target.x} ${target.y}`;
}

function edgeIsActive(edge) {
  return edge.source === selectedId || edge.target === selectedId;
}

function updateViewportTransform() {
  const viewport = graph.querySelector("#viewport");
  if (viewport) {
    viewport.setAttribute("transform", `translate(${transform.x} ${transform.y}) scale(${transform.scale})`);
  }
}

function drawGraph() {
  const topic = activeTopic();
  const rect = graph.getBoundingClientRect();
  const width = Math.max(1120, Math.round(rect.width || 1200));
  const height = Math.max(720, Math.round(rect.height || 760));
  const { incoming, outgoing } = relationMaps(topic);
  const selectedRelations = new Set([
    ...incoming.get(selectedId).map((edge) => `${edge.source}->${edge.target}`),
    ...outgoing.get(selectedId).map((edge) => `${edge.source}->${edge.target}`)
  ]);
  const layoutState = layout(topic, width, height);
  const colorsByArea = areaColors(topic);

  graph.setAttribute("viewBox", `0 0 ${width} ${height}`);
  graph.replaceChildren();

  const defs = makeSvg("defs");
  const marker = makeSvg("marker", {
    id: "arrowhead",
    viewBox: "0 0 12 12",
    refX: "10",
    refY: "6",
    markerWidth: "8",
    markerHeight: "8",
    orient: "auto"
  });
  marker.append(makeSvg("path", { d: "M 1 1 L 11 6 L 1 11 z", fill: "#6d7480" }));
  defs.append(marker);
  graph.append(defs);

  const viewport = makeSvg("g", {
    id: "viewport",
    transform: `translate(${transform.x} ${transform.y}) scale(${transform.scale})`
  });

  const yearLayer = makeSvg("g", { class: "years" });
  for (let year = 2019; year <= layoutState.maxYear; year += 1) {
    const x = layoutState.margin.left + ((year - layoutState.minYear) / Math.max(1, layoutState.maxYear - layoutState.minYear)) * (width - layoutState.margin.left - layoutState.margin.right);
    yearLayer.append(makeSvg("line", { class: "year-line", x1: x, x2: x, y1: 42, y2: height - 48 }));
    const label = makeSvg("text", { class: "year-label", x, y: 34, "text-anchor": "middle" });
    label.textContent = String(year);
    yearLayer.append(label);
  }
  viewport.append(yearLayer);

  const edgeLayer = makeSvg("g", { class: "edges" });
  topic.edges.forEach(([sourceId, targetId, relation]) => {
    const source = layoutState.points.get(sourceId);
    const target = layoutState.points.get(targetId);
    if (!source || !target) return;
    const key = `${sourceId}->${targetId}`;
    const active = selectedRelations.has(key);
    const path = makeSvg("path", {
      class: `edge ${active ? "active" : "quiet"}`,
      d: edgePath(source, target),
      "marker-end": "url(#arrowhead)",
      "data-relation": relation
    });
    edgeLayer.append(path);
  });
  viewport.append(edgeLayer);

  const nodeLayer = makeSvg("g", { class: "nodes" });
  topic.papers.forEach((paper) => {
    const point = layoutState.points.get(paper.id);
    const active = paper.id === selectedId;
    const linked = paper.id === selectedId || incoming.get(selectedId).some((edge) => edge.source === paper.id) || outgoing.get(selectedId).some((edge) => edge.target === paper.id);
    const group = makeSvg("g", {
      class: `node-group ${active ? "active" : ""} ${linked ? "" : "quiet"}`,
      tabindex: "0",
      role: "button",
      "aria-label": paper.title
    });
    group.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    group.addEventListener("click", () => selectPaper(paper.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPaper(paper.id);
      }
    });

    const radius = active ? 18 : 13;
    group.append(makeSvg("circle", {
      class: "node-halo",
      cx: point.x,
      cy: point.y,
      r: radius + 9
    }));
    group.append(makeSvg("circle", {
      class: "node",
      cx: point.x,
      cy: point.y,
      r: radius,
      fill: colorsByArea.get(paper.area)
    }));

    const label = shortTitle(paper.title);
    const labelX = point.x + 22;
    const labelY = point.y + 4;
    const labelWidth = Math.min(190, Math.max(62, label.length * 7.2 + 16));
    group.append(makeSvg("rect", {
      class: "node-label-bg",
      x: labelX - 7,
      y: labelY - 16,
      width: labelWidth,
      height: 24,
      rx: 6
    }));
    const text = makeSvg("text", { class: "node-label", x: labelX, y: labelY });
    text.textContent = label;
    group.append(text);
    nodeLayer.append(group);
  });
  viewport.append(nodeLayer);
  graph.append(viewport);

  renderLegend(colorsByArea);
}

function renderLegend(colorsByArea) {
  const legend = document.querySelector("#legend");
  legend.replaceChildren();
  colorsByArea.forEach((color, area) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="dot" style="--dot:${color}"></span>${area}`;
    legend.append(item);
  });
}

function renderTabs() {
  topicTabs.replaceChildren();
  topics.forEach((topic) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "topic-tab";
    tab.setAttribute("aria-pressed", String(topic.id === activeTopicId));
    tab.textContent = topic.label;
    tab.addEventListener("click", () => {
      activeTopicId = topic.id;
      selectedId = topic.papers[0].id;
      transform = { x: 0, y: 0, scale: 1 };
      render();
    });
    topicTabs.append(tab);
  });
}

function renderTopicHeader() {
  const topic = activeTopic();
  graphTitle.textContent = topic.title;
  graphSummary.textContent = topic.summary;
  graphMeta.textContent = `${topic.papers.length} papers / ${topic.edges.length} citation links / ${topic.years}`;
}

function renderDetails() {
  const topic = activeTopic();
  const paper = activePaper();
  const map = paperMap(topic);
  const { incoming, outgoing } = relationMaps(topic);
  const cites = incoming.get(paper.id);
  const citedBy = outgoing.get(paper.id);

  detail.innerHTML = `
    <div class="detail-kicker">${paper.year} / ${paper.venue}</div>
    <h2>${paper.title}</h2>
    <div class="meta">
      <span>${paper.area}</span>
      <span>${paper.citationBand} citations</span>
      <span>${paper.authors.length} authors</span>
    </div>
    <p>${paper.contribution}</p>
    <p><strong>Authors:</strong> ${paper.authors.join(", ")}</p>
    ${relations("Cites", cites, "source", map)}
    ${relations("Cited by", citedBy, "target", map)}
    <a class="paper-link" href="${paper.url}" target="_blank" rel="noreferrer">Open paper</a>
  `;
}

function relations(label, edges, side, map) {
  if (!edges.length) return "";
  const items = edges
    .map((edge) => {
      const other = map.get(edge[side]);
      return `<li><button type="button" data-paper="${other.id}">${shortTitle(other.title)}</button><span>${edge.relation}</span></li>`;
    })
    .join("");
  return `<section class="relations"><h3>${label}</h3><ul>${items}</ul></section>`;
}

function bindDetailRelations() {
  detail.querySelectorAll("[data-paper]").forEach((button) => {
    button.addEventListener("click", () => selectPaper(button.dataset.paper));
  });
}

function selectPaper(id) {
  selectedId = id;
  drawGraph();
  renderDetails();
  bindDetailRelations();
}

function zoomAt(delta, centerX, centerY) {
  const nextScale = Math.min(2.8, Math.max(0.52, transform.scale * delta));
  const scaleRatio = nextScale / transform.scale;
  transform.x = centerX - (centerX - transform.x) * scaleRatio;
  transform.y = centerY - (centerY - transform.y) * scaleRatio;
  transform.scale = nextScale;
  updateViewportTransform();
}

graph.addEventListener("wheel", (event) => {
  event.preventDefault();
  const rect = graph.getBoundingClientRect();
  const centerX = event.clientX - rect.left;
  const centerY = event.clientY - rect.top;
  zoomAt(event.deltaY < 0 ? 1.12 : 0.89, centerX, centerY);
}, { passive: false });

graph.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest(".node-group")) {
    return;
  }
  isDragging = true;
  dragStart = { x: event.clientX, y: event.clientY };
  dragOrigin = { x: transform.x, y: transform.y };
  graph.setPointerCapture(event.pointerId);
  graph.classList.add("dragging");
});

graph.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  transform.x = dragOrigin.x + event.clientX - dragStart.x;
  transform.y = dragOrigin.y + event.clientY - dragStart.y;
  updateViewportTransform();
});

graph.addEventListener("pointerup", (event) => {
  if (!isDragging) return;
  isDragging = false;
  if (graph.hasPointerCapture(event.pointerId)) {
    graph.releasePointerCapture(event.pointerId);
  }
  graph.classList.remove("dragging");
});

graph.addEventListener("pointercancel", (event) => {
  isDragging = false;
  if (graph.hasPointerCapture(event.pointerId)) {
    graph.releasePointerCapture(event.pointerId);
  }
  graph.classList.remove("dragging");
});

zoomIn.addEventListener("click", () => zoomAt(1.18, graph.clientWidth / 2, graph.clientHeight / 2));
zoomOut.addEventListener("click", () => zoomAt(0.84, graph.clientWidth / 2, graph.clientHeight / 2));
zoomReset.addEventListener("click", () => {
  transform = { x: 0, y: 0, scale: 1 };
  drawGraph();
});

window.addEventListener("resize", () => window.requestAnimationFrame(drawGraph));

function render() {
  renderTabs();
  renderTopicHeader();
  drawGraph();
  renderDetails();
  bindDetailRelations();
}

render();
