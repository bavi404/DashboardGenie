function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size = size;
  this.inputManager = new InputManager();
  this.storageManager = new StorageManager();
  this.actuator = new Actuator();
  this.startTiles = 2;
  this.moves = 0;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame();
  this.setup();
};

// Continue playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame();
};

// Check if game is over
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Game Setup
GameManager.prototype.setup = function () {
  let previousState = this.storageManager.getGameState();

  if (previousState) {
    this.loadPreviousState(previousState);
  } else {
    this.initNewGame();
  }
  this.actuate();
};

// Load Previous Game State
GameManager.prototype.loadPreviousState = function (state) {
  this.grid = new Grid(state.grid.size, state.grid.cells);
  this.score = state.score;
  this.over = state.over;
  this.won = state.won;
  this.keepPlaying = state.keepPlaying;
};

// Initialize New Game
GameManager.prototype.initNewGame = function () {
  this.grid = new Grid(this.size);
  this.score = 0;
  this.over = false;
  this.won = false;
  this.keepPlaying = false;

  for (let i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Add a tile at a random location
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile = new Tile(this.grid.randomAvailableCell(), value);
    this.grid.insertTile(tile);
  }
};

// Actuate (Render the grid)
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  this.over ? this.storageManager.clearGameState() : this.storageManager.setGameState(this.serialize());

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won,
    bestScore: this.storageManager.getBestScore(),
    terminated: this.isGameTerminated(),
  });
};

// Serialize Game State
GameManager.prototype.serialize = function () {
  return {
    grid: this.grid.serialize(),
    score: this.score,
    over: this.over,
    won: this.won,
    keepPlaying: this.keepPlaying,
  };
};

// Prepare Tiles for Movement
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell((x, y, tile) => {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move Tiles in the Given Direction
GameManager.prototype.move = function (direction) {
  if (this.isGameTerminated()) return;

  const vector = this.getVector(direction);
  const traversals = this.buildTraversals(vector);
  let moved = false;

  this.prepareTiles();

  traversals.x.forEach(x => {
    traversals.y.forEach(y => {
      const cell = { x, y };
      const tile = this.grid.cellContent(cell);

      if (tile) {
        const positions = this.findFarthestPosition(cell, vector);
        const next = this.grid.cellContent(positions.next);

        if (next && next.value === tile.value && !next.mergedFrom) {
          this.mergeTiles(tile, next, positions);
        } else {
          this.moveTile(tile, positions.farthest);
        }

        if (!this.positionsEqual(cell, tile)) {
          moved = true;
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();
    if (!this.movesAvailable()) this.over = true;
    this.actuate();
  }
};

// Merge Tiles
GameManager.prototype.mergeTiles = function (tile, next, positions) {
  const merged = new Tile(positions.next, tile.value * 2);
  merged.mergedFrom = [tile, next];

  this.grid.insertTile(merged);
  this.grid.removeTile(tile);

  tile.updatePosition(positions.next);
  this.score += merged.value;

  if (merged.value === 2048) this.won = true;
};

// Get Movement Vectors
GameManager.prototype.getVector = function (direction) {
  return [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }  // Left
  ][direction];
};

// Build Traversal Paths
GameManager.prototype.buildTraversals = function (vector) {
  const traversals = { x: Array.from({ length: this.size }, (_, i) => i), y: [] };
  traversals.y = traversals.x.slice();

  if (vector.x === 1) traversals.x.reverse();
  if (vector.y === 1) traversals.y.reverse();

  return traversals;
};

// Find Farthest Position
GameManager.prototype.findFarthestPosition = function (cell, vector) {
  let previous;
  do {
    previous = cell;
    cell = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

  return { farthest: previous, next: cell };
};

// Check Available Moves
GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Tile Matches for Merge
GameManager.prototype.tileMatchesAvailable = function () {
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      const tile = this.grid.cellContent({ x, y });
      if (tile) {
        for (let dir = 0; dir < 4; dir++) {
          const vector = this.getVector(dir);
          const cell = { x: x + vector.x, y: y + vector.y };
          const other = this.grid.cellContent(cell);
          if (other && other.value === tile.value) return true;
        }
      }
    }
  }
  return false;
};

// Check Tile Positions
GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
