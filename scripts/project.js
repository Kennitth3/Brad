// -------------------------
// Initialize Game Engine
// -------------------------
const engine = new GameEngine();
window.engine = engine; // Make global so editor functions can access it

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

  setTimeout(() => {
    window.createEditors(engine);
    window.setupFileUploads(engine);
  }, 500);
}

// Button to load default assets
document.getElementById("load-assets").addEventListener("click", loadDefaultAssets);

// -------------------------
// Canvas Drag & Drop for Assets
// -------------------------
const canvas = engine.canvas;

canvas.addEventListener("dragover", (e) => e.preventDefault());

canvas.addEventListener("drop", (e) => {
  e.preventDefault();

  const assetName = e.dataTransfer.getData("text/plain");
  if (!assetName || !engine.assets[assetName]) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  engine.createEntity("tile", x, y, assetName);
});

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
// Start Game Loop
// -------------------------
engine.start();
