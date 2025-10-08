import { GameEngine } from "./gameEngine.js";
import { createEditors } from "./editor.js";

const engine = new GameEngine();

// Load images for map editor
document.getElementById("load-assets").addEventListener("click", () => {
  const assetList = [
    { name: "player", path: "assets/pngtree-soccer-player-image_1200612.jpg" },
    { name: "grass", path: "assets/grass.png" },
    { name: "enemy", path: "assets/enemy.png" },
  ];

  assetList.forEach((a) => engine.loadAsset(a.name, a.path));

  // Wait for images to load
  setTimeout(() => {
    createEditors(engine);
  }, 500);
});

engine.start();
