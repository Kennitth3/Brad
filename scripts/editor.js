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

function setupFileUploads(engine) {
  // Upload Images
  const assetInput = document.getElementById("upload-assets");
  assetInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        const name = file.name.split(".")[0];
        engine.assets[name] = img;

        // Refresh asset panel
        createMapEditor(engine);
      };
      reader.readAsDataURL(file);
    });
  });

  // Upload Scripts
  const scriptInput = document.getElementById("upload-scripts");
  scriptInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Dynamically evaluate the uploaded JS
          eval(event.target.result);
          console.log(`Script loaded: ${file.name}`);
        } catch (err) {
          console.error(`Error loading ${file.name}:`, err);
        }
      };
      reader.readAsText(file);
    });
  });
}
