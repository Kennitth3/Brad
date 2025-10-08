// -------------------------
// Initialize Game Engine
// -------------------------
const engine = new GameEngine();

// -------------------------
// Load Default Assets
// -------------------------
function loadDefaultAssets() {
  const defaultAssets = [
    { name: "player", path: "assets/player.png" },
    { name: "grass", path: "assets/grass.png" },
    { name: "enemy", path: "assets/enemy.png" },
  ];

  defaultAssets.forEach((asset) => engine.loadAsset(asset.name, asset.path));

  // Wait a short time to ensure images load
  setTimeout(() => {
    createEditors(engine);       // Setup player & map editors
    setupFileUploads(engine);    // Setup file upload inputs
  }, 500);
}

// Button to load default assets
document.getElementById("load-assets").addEventListener("click", loadDefaultAssets);

// -------------------------
// Drag & Drop Images to Canvas
// -------------------------
function enableCanvasDragDrop() {
  const canvas = engine.canvas;

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

        // Refresh the map editor asset panel
        createEditors(engine);
      };
      reader.readAsDataURL(file);
    });
  });
}

// Enable drag & drop immediately
enableCanvasDragDrop();

// -------------------------
// Map Save / Load
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

// Map tab UI connections
document.getElementById("save-map").addEventListener("click", saveMap);

document.getElementById("load-map").addEventListener("change", (e) => {
  if (!e.target.files.length) return;
  loadMap(e.target.files[0]);
});

// -------------------------
// Start the Game Loop
// -------------------------
engine.start();
