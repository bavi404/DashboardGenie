class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.rebuildFromState(previousState) : this.initializeEmptyGrid();
  }

  initializeEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  rebuildFromState(state) {
    return state.map((row, x) =>
      row.map((tile) => (tile ? new Tile(tile.position, tile.value) : null))
    );
  }

  findRandomAvailableCell() {
    const cells = this.getAvailableCells();
    return cells.length ? cells[Math.floor(Math.random() * cells.length)] : null;
  }

  getAvailableCells() {
    const cells = [];
    this.iterateCells((x, y, tile) => {
      if (!tile) cells.push({ x, y });
    });
    return cells;
  }

  iterateCells(callback) {
    this.cells.forEach((row, x) => {
      row.forEach((tile, y) => callback(x, y, tile));
    });
  }

  isAnyCellAvailable() {
    return this.getAvailableCells().length > 0;
  }

  isCellAvailable(cell) {
    return !this.isCellOccupied(cell);
  }

  isCellOccupied(cell) {
    return !!this.getCellContent(cell);
  }

  getCellContent(cell) {
    return this.isWithinBounds(cell) ? this.cells[cell.x][cell.y] : null;
  }

  addTile(tile) {
    if (this.isWithinBounds(tile)) {
      this.cells[tile.x][tile.y] = tile;
    }
  }

  deleteTile(tile) {
    if (this.isWithinBounds(tile)) {
      this.cells[tile.x][tile.y] = null;
    }
  }

  isWithinBounds(position) {
    const { x, y } = position;
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  toJSON() {
    return {
      size: this.size,
      cells: this.cells.map((row) =>
        row.map((tile) => (tile ? tile.serialize() : null))
      ),
    };
  }
}
