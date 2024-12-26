class InputHandler {
  constructor() {
    this.eventRegistry = {};

    this.touchEvents = window.navigator.msPointerEnabled
      ? {
          start: "MSPointerDown",
          move: "MSPointerMove",
          end: "MSPointerUp",
        }
      : {
          start: "touchstart",
          move: "touchmove",
          end: "touchend",
        };

    this.setupEventListeners();
  }

  on(eventType, callback) {
    if (!this.eventRegistry[eventType]) {
      this.eventRegistry[eventType] = [];
    }
    this.eventRegistry[eventType].push(callback);
  }

  trigger(eventType, payload) {
    const eventCallbacks = this.eventRegistry[eventType];
    if (eventCallbacks) {
      eventCallbacks.forEach((cb) => cb(payload));
    }
  }

  setupEventListeners() {
    const movementKeys = {
      38: 0, 39: 1, 40: 2, 37: 3, // Arrow keys
      75: 0, 76: 1, 74: 2, 72: 3, // Vim keys
      87: 0, 68: 1, 83: 2, 65: 3  // WASD keys
    };

    document.addEventListener("keydown", (event) => {
      const isModified = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      const moveDirection = movementKeys[event.which];

      if (!isModified && moveDirection !== undefined) {
        event.preventDefault();
        this.trigger("move", moveDirection);
      }

      if (!isModified && event.which === 82) {
        this.resetGame(event);
      }
    });

    this.setupButtonHandlers(".retry-button", this.resetGame);
    this.setupButtonHandlers(".restart-button", this.resetGame);
    this.setupButtonHandlers(".keep-playing-button", this.continueGame);

    this.setupSwipeEvents();
  }

  setupSwipeEvents() {
    let startX, startY;
    const gameArea = document.querySelector(".game-container");

    gameArea.addEventListener(this.touchEvents.start, (event) => {
      if (event.touches?.length > 1) return;

      if (window.navigator.msPointerEnabled) {
        startX = event.pageX;
        startY = event.pageY;
      } else {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      }

      event.preventDefault();
    });

    gameArea.addEventListener(this.touchEvents.move, (event) => {
      event.preventDefault();
    });

    gameArea.addEventListener(this.touchEvents.end, (event) => {
      if (event.touches?.length > 0) return;

      let endX, endY;
      if (window.navigator.msPointerEnabled) {
        endX = event.pageX;
        endY = event.pageY;
      } else {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
      }

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) {
        const direction = Math.abs(deltaX) > Math.abs(deltaY)
          ? (deltaX > 0 ? 1 : 3)
          : (deltaY > 0 ? 2 : 0);
        this.trigger("move", direction);
      }
    });
  }

  resetGame(event) {
    event.preventDefault();
    this.trigger("restart");
  }

  continueGame(event) {
    event.preventDefault();
    this.trigger("keepPlaying");
  }

  setupButtonHandlers(selector, handler) {
    const button = document.querySelector(selector);
    button.addEventListener("click", handler.bind(this));
    button.addEventListener(this.touchEvents.end, handler.bind(this));
  }
}
