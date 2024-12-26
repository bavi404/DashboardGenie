(function () {
  let lastExecutionTime = 0;
  const prefixes = ['webkit', 'moz'];

  for (let i = 0; i < prefixes.length && !window.requestAnimationFrame; i++) {
    window.requestAnimationFrame = window[prefixes[i] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[prefixes[i] + 'CancelAnimationFrame'] ||
      window[prefixes[i] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => {
      const now = Date.now();
      const delay = Math.max(0, 16 - (now - lastExecutionTime));
      const timeoutId = setTimeout(() => callback(now + delay), delay);
      
      lastExecutionTime = now + delay;
      return timeoutId;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (timeoutId) => {
      clearTimeout(timeoutId);
    };
  }
})();
