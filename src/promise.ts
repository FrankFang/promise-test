class Promise2 {
  state = "pending";
  callbacks = [];
  resolve = result => {
    /* 完善 */
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.callbacks.forEach(handlers => {
        const [succeed] = handlers;
        if (typeof succeed === 'function') {
          succeed.call(undefined, result);
        }
      });
    }, 0);
  }
  reject = reason => {
    /* 完善 */
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.callbacks.forEach(handlers => {
        const [, fail] = handlers;
        if (typeof fail === 'function') {
          fail.call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') {
      throw new Error('给劳资传函数');
    }
    fn(this.resolve, this.reject);
  }
  then(succeed?, fail?) {
    /* 完善 */
    const handlers = [];
    if (typeof succeed === 'function') {
      handlers[0] = succeed;
    }
    if (typeof fail === 'function') {
      handlers[1] = fail;
    }
    if (handlers.length) {
      this.callbacks.push(handlers);
    }
  }
}

export default Promise2;

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}
