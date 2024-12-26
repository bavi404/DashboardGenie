class GameTile {
  constructor({ x, y }, value = 2) {
    this.coordinates = { x, y };
    this.value = value;

    this.lastPosition = null;
    this.mergedTiles = null;
  }

  recordLastPosition() {
    this.lastPosition = { ...this.coordinates };
  }

  moveTo(newPosition) {
    this.coordinates = { ...newPosition };
  }

  toJSON() {
    return {
      position: { ...this.coordinates },
      value: this.value,
    };
  }
}
