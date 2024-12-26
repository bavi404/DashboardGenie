(function () {
  if (typeof window.Element === "undefined" || "classList" in document.documentElement) {
    return;
  }

  class DOMTokenList {
    constructor(el) {
      this.el = el;
      const classes = el.className.trim().split(/\s+/);
      classes.forEach(cls => this.push(cls));
    }

    add(token) {
      if (!this.contains(token)) {
        this.push(token);
        this.el.className = this.toString();
      }
    }

    contains(token) {
      return this.el.className.split(/\s+/).includes(token);
    }

    item(index) {
      return this[index] || null;
    }

    remove(token) {
      if (this.contains(token)) {
        const index = this.indexOf(token);
        if (index > -1) {
          this.splice(index, 1);
          this.el.className = this.toString();
        }
      }
    }

    toggle(token) {
      this.contains(token) ? this.remove(token) : this.add(token);
      return this.contains(token);
    }

    toString() {
      return Array.from(this).join(' ');
    }
  }

  Object.defineProperty(window, 'DOMTokenList', {
    value: DOMTokenList,
    writable: true,
    configurable: true
  });

  function defineElementGetter(obj, prop, getter) {
    Object.defineProperty(obj, prop, {
      get: getter
    });
  }

  defineElementGetter(HTMLElement.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });

})();
