export class GameEngine {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.entities = [];
    this.assets = {};
    this.tileSize = 64;
  }

  loadAsset(name, path) {
    const img = new Image();
    img.src = path;
    this.assets[name] = img;
  }

  createEntity(type, x, y, assetName) {
    this.entities.push({
      type,
      x,
      y,
      assetName,
      draw: (ctx, assets) => {
        const img = assets[assetName];
        if (img) ctx.drawImage(img, x, y, 64, 64);
      },
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach((e) => e.draw(this.ctx, this.assets));
  }

  start() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
