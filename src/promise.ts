class Promise2 {
  state = 'pending';
  callbacks = [];
  resolve(result) {
    /* 完善 */
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      for (var i = 0; i < this.callbacks.length; i++) {
        if (typeof this.callbacks[i][0] === 'function') {
          this.callbacks[i][0].call(undefined, result);
        }
      }
    }, 0);
  }
  reject(reason) {
    /* 完善 */
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      for (var i = 0; i < this.callbacks.length; i++) {
        if (typeof this.callbacks[i][1] === 'function') {
          this.callbacks[i][1].call(undefined, reason);
        }
      }
    }, 0);
  }
  constructor(fn) {
    /* 完善 */
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    /* 完善 */
    let callback = [];
    if (typeof succeed === 'function') {
      callback[0] = succeed;
    }
    if (typeof fail === 'function') {
      callback[1] = fail;
    }
    this.callbacks.push(callback);
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
