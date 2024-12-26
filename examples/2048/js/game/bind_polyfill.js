Function.prototype.bind = Function.prototype.bind || function (context) {
  const originalFn = this;
  
  return function (...args) {
    return originalFn.apply(context, args);
  };
};
