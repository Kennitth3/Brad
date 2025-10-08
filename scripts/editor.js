import { GameEngine } from "./gameEngine.js";

export function createEditors(engine) {
  createPlayerEditor();
  createMapEditor(engine);
}

function createPlayerEditor() {
  const speedInput = document.getElementById("player-speed");
  const jumpInput = document.getElementById("player-jump");

  speedInput.addEventListener("input", () => {
    console.log("Player speed:", speedInput.value);
  });
  jumpInput.addEventListener("input", () => {
    console.log("Player jump:", jumpInput.value);
  });
}

function createMapEditor(engine) {
  const panel = document.getElementById("asset-panel");
  const assets = Object.keys(engine.assets);

  panel.innerHTML = "";
  assets.forEach((name) => {
    const tile = document.createElement("div");
    tile.classList.add("asset");
    tile.style.backgroundImage = `url(${engine.assets[name].src})`;
    tile.draggable = true;
    tile.dataset.asset = name;

    panel.appendChild(tile);
  });

  setupDragAndDrop(engine);
}

function setupDragAndDrop(engine) {
  const canvas = engine.canvas;

  canvas.addEventListener("dragover", (e) => e.preventDefault());
  canvas.addEventListener("drop", (e) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const asset = e.dataTransfer.getData("asset");
    if (asset) {
      const gridX = Math.floor(x / engine.tileSize) * engine.tileSize;
      const gridY = Math.floor(y / engine.tileSize) * engine.tileSize;
      engine.createEntity("tile", gridX, gridY, asset);
    }
  });

  const assets = document.querySelectorAll(".asset");
  assets.forEach((asset) => {
    asset.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("asset", e.target.dataset.asset);
    });
  });
}

import { GameEngine } from "./gameEngine.js";

export function createEditors(engine) {
  createPlayerEditor();
  createMapEditor(engine);
}

function createPlayerEditor() {
  const speedInput = document.getElementById("player-speed");
  const jumpInput = document.getElementById("player-jump");

  speedInput.addEventListener("input", () => {
    console.log("Player speed:", speedInput.value);
  });
  jumpInput.addEventListener("input", () => {
    console.log("Player jump:", jumpInput.value);
  });
}

function createMapEditor(engine) {
  const panel = document.getElementById("asset-panel");
  const assets = Object.keys(engine.assets);

  panel.innerHTML = "";
  assets.forEach((name) => {
    const tile = document.createElement("div");
    tile.classList.add("asset");
    tile.style.backgroundImage = `url(${engine.assets[name].src})`;
    tile.draggable = true;
    tile.dataset.asset = name;

    panel.appendChild(tile);
  });

  setupDragAndDrop(engine);
}

function setupDragAndDrop(engine) {
  const canvas = engine.canvas;

  canvas.addEventListener("dragover", (e) => e.preventDefault());
  canvas.addEventListener("drop", (e) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const asset = e.dataTransfer.getData("asset");
    if (asset) {
      const gridX = Math.floor(x / engine.tileSize) * engine.tileSize;
      const gridY = Math.floor(y / engine.tileSize) * engine.tileSize;
      engine.createEntity("tile", gridX, gridY, asset);
    }
  });

  const assets = document.querySelectorAll(".asset");
  assets.forEach((asset) => {
    asset.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("asset", e.target.dataset.asset);
    });
  });
}

// Tab switching logic
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    // Activate clicked tab
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

