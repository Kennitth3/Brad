// -------------------------
// Editor functions
// -------------------------

// Create Player Editor (simplified for now)
function createPlayerEditor() {
  const speedInput = document.getElementById("player-speed");
  const jumpInput = document.getElementById("player-jump");

  if (!speedInput || !jumpInput) return;

  speedInput.addEventListener("input", () => {
    if (window.engine && window.engine.player) {
      window.engine.player.speed = parseFloat(speedInput.value);
    }
  });

  jumpInput.addEventListener("input", () => {
    if (window.engine && window.engine.player) {
      window.engine.player.jump = parseFloat(jumpInput.value);
    }
  });
}

// Create Map Editor
function createMapEditor(engine) {
  const assetPanel = document.getElementById("asset-panel");
  if (!assetPanel) return;

  assetPanel.innerHTML = "";

  // Show all assets as draggable divs
  Object.keys(engine.assets).forEach((name) => {
    const div = document.createElement("div");
    div.className = "asset";
    div.style.backgroundImage = `url(${engine.assets[name].src})`;
    div.draggable = true;
    div.dataset.asset = name;

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", name);
    });

    assetPanel.appendChild(div);
  });
}

// Main editor setup function
function createEditors(engine) {
  createPlayerEditor();
  createMapEditor(engine);
}

// -------------------------
// File uploads (Assets & Scripts)
// -------------------------
function setupFileUploads(engine) {
  const uploadAssetsInput = document.getElementById("upload-assets");

  uploadAssetsInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        const name = file.name.split(".")[0];

        // Add image to engine assets
        engine.assets[name] = img;

        // Refresh the asset panel
        createEditors(engine);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be uploaded again
    e.target.value = "";
  });

  // Optional: Script uploads (.js files)
  const uploadScriptsInput = document.getElementById("upload-scripts");
  if (uploadScriptsInput) {
    uploadScriptsInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        if (!file.name.endsWith(".js")) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            eval(event.target.result); // Runs uploaded script globally
            console.log(`Loaded script: ${file.name}`);
          } catch (err) {
            console.error(`Error loading script ${file.name}:`, err);
          }
        };
        reader.readAsText(file);
      });

      e.target.value = "";
    });
  }
}

// -------------------------
// Make functions global
// -------------------------
window.createEditors = createEditors;
window.setupFileUploads = setupFileUploads;
