// Make sure GameEngine, createEditors, setupFileUploads are already loaded globally

const engine = new GameEngine();

// -------------------------
// Helper: Load default assets
// -------------------------
function loadDefaultAssets() {
  const defaultAssets = [
    { name: "player", path: "assets/player.png" },
    { name: "grass", path: "assets/grass.png" },
    { name: "enemy", path: "assets/enemy.png" },
  ];

  defaultAssets.forEach((asset) => engine.loadAsset(asset.name, asset.path));

  setTimeout(() => {
    createEditors(engine);
    setupFileUploads(engine);
  }, 500);
}

// -------------------------
// Drag & Drop for user images
// -------------------------
function enableCanvasDragDrop() {
  const canvas = engine.canvas;

  // Allow dropping files on the canvas
  canvas.addEventListener("dragover", (e) => e.preventDefault());

  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        const name = file.name.split(".")[0];
        engine.assets[name] = img;

        // Refresh asset panel in the map editor
        createEditors(engine);
      };
      reader.readAsDataURL(file);
    });
  });
}

// -------------------------
// Save / Load map as JSON
// -------------------------
function saveMap() {
  const mapData = engine.entities.map((e) => ({
    type: e.type,
    x: e.x,
    y: e.y,
    assetName: e.assetName,
  }));
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapData));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "map.json");
  dlAnchor.click();
}

function loadMap(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const mapData = JSON.parse(e.target.result);
      engine.entities = [];
      mapData.forEach((e) => engine.createEntity(e.type, e.x, e.y, e.assetName));
    } catch (err) {
      console.error("Failed to load map:", err);
    }
  };
  reader.readAsText(file);
}

// -------------------------
// Setup UI for map saving/loading
// -------------------------
function setupMapSaveLoad() {
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Map";
  saveBtn.addEventListener("click", saveMap);
  document.getElementById("map-editor").appendChild(saveBtn);

  const loadInput = document.createElement("input");
  loadInput.type = "file";
  loadInput.accept = ".json";
  loadInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) loadMap(e.target.files[0]);
  });
  document.getElementById("map-editor").appendChild(loadInput);
}

// -------------------------
// Initialize everything
// -------------------------
document.getElementById("load-assets").addEventListener("click", () => {
  loadDefaultAssets();
});

enableCanvasDragDrop();
setupMapSaveLoad();

// Start the game loop
engine.start();
