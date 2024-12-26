window.mockStorage = {
  dataStore: {},

  set(key, value) {
    this.dataStore[key] = String(value);
  },

  get(key) {
    return this.dataStore.hasOwnProperty(key) ? this.dataStore[key] : undefined;
  },

  remove(key) {
    return delete this.dataStore[key];
  },

  clearAll() {
    this.dataStore = {};
  }
};

class StorageHandler {
  constructor() {
    this.keys = {
      bestScore: "bestScore",
      gameState: "gameState",
    };

    this.storageBackend = this.isLocalStorageAvailable() ? window.localStorage : window.mockStorage;
  }

  isLocalStorageAvailable() {
    const testKey = "testKey";
    try {
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Best score methods
  fetchBestScore() {
    return this.storageBackend.getItem(this.keys.bestScore) || 0;
  }

  updateBestScore(score) {
    this.storageBackend.setItem(this.keys.bestScore, score);
  }

  // Game state methods
  fetchGameState() {
    const gameStateJSON = this.storageBackend.getItem(this.keys.gameState);
    return gameStateJSON ? JSON.parse(gameStateJSON) : null;
  }

  updateGameState(gameState) {
    this.storageBackend.setItem(this.keys.gameState, JSON.stringify(gameState));
  }

  resetGameState() {
    this.storageBackend.removeItem(this.keys.gameState);
  }
}
