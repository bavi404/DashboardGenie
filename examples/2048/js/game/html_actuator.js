class HTMLRenderer {
  constructor() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreDisplay = document.querySelector(".score-container");
    this.bestDisplay = document.querySelector(".best-container");
    this.messageDisplay = document.querySelector(".game-message");
    this.movesCount = 0;

    this.currentScore = 0;
  }

  render(grid, metadata) {
    requestAnimationFrame(() => {
      this.clearElement(this.tileContainer);

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.placeTile(cell);
          }
        });
      });

      this.refreshScore(metadata.score);
      this.refreshBestScore(metadata.bestScore);

      if (metadata.terminated) {
        metadata.over
          ? this.displayMessage(false)
          : metadata.won && this.displayMessage(true);
      }
    });
  }

  proceedGame() {
    this.resetMessage();
  }

  clearElement(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  placeTile(tile) {
    const tileWrapper = document.createElement("div");
    const tileInner = document.createElement("div");
    const previousPosition = tile.previousPosition || { x: tile.x, y: tile.y };
    const positionClass = this.generatePositionClass(previousPosition);

    const tileClasses = [
      "tile",
      `tile-${tile.value}`,
      positionClass,
      tile.value > 2048 ? "tile-super" : "",
    ].filter(Boolean);

    this.applyClassList(tileWrapper, tileClasses);

    tileInner.classList.add("tile-inner");
    tileInner.textContent = tile.value;

    if (tile.previousPosition) {
      requestAnimationFrame(() => {
        tileClasses[2] = this.generatePositionClass({ x: tile.x, y: tile.y });
        this.applyClassList(tileWrapper, tileClasses);
      });
    } else if (tile.mergedFrom) {
      tileClasses.push("tile-merged");
      this.applyClassList(tileWrapper, tileClasses);

      tile.mergedFrom.forEach((mergedTile) => this.placeTile(mergedTile));
    } else {
      tileClasses.push("tile-new");
      this.applyClassList(tileWrapper, tileClasses);
    }

    tileWrapper.appendChild(tileInner);
    this.tileContainer.appendChild(tileWrapper);
  }

  applyClassList(element, classList) {
    element.className = classList.join(" ");
  }

  adjustPosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  }

  generatePositionClass(position) {
    const adjusted = this.adjustPosition(position);
    return `tile-position-${adjusted.x}-${adjusted.y}`;
  }

  refreshScore(newScore) {
    this.clearElement(this.scoreDisplay);

    const scoreDiff = newScore - this.currentScore;
    this.currentScore = newScore;
    this.scoreDisplay.textContent = this.currentScore;

    if (scoreDiff > 0) {
      const scoreIncrement = document.createElement("div");
      scoreIncrement.classList.add("score-addition");
      scoreIncrement.textContent = `+${scoreDiff}`;

      this.scoreDisplay.appendChild(scoreIncrement);
    }
  }

  refreshBestScore(bestScore) {
    this.bestDisplay.textContent = bestScore;
  }

  displayMessage(victory) {
    const resultType = victory ? "game-won" : "game-over";
    const resultMessage = victory ? "You win!" : "Game over!";

    this.messageDisplay.classList.add(resultType);
    this.messageDisplay.querySelector("p").textContent = resultMessage;

    window.client.addEvent("high_score_event", {
      best_score: this.currentScore,
    });
    window.client.addEvent("move_counter", {
      moves: this.movesCount,
    });
  }

  resetMessage() {
    this.messageDisplay.classList.remove("game-won", "game-over");
  }
}
