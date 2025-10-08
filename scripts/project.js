// Make sure GameEngine, createEditors, setupFileUploads are already loaded globally
// from gameEngine.js and editor.js

// Initialize engine
const engine = new GameEngine();

// Load default assets when user clicks button
document.getElementById("load-assets").addEventListener("click", () => {
  const defaultAssets = [
    { name: "player", path: "assets/player.png" },
    { name: "grass", path: "assets/grass.png" },
    { name: "enemy", path: "assets/enemy.png" },
  ];

  defaultAssets.forEach((asset) => engine.loadAsset(asset.name, asset.path));

  // Wait a short time to ensure images load, then initialize editors
  setTimeout(() => {
    createEditors(engine);
    setupFileUploads(engine); // Enable user uploads
  }, 500);
});

// Start the game loop
engine.start();
