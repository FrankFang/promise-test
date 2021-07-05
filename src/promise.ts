class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.callbacks.forEach(handler => {
        if (typeof handler[0] === "function") {
          handler[0].call(undefined, result);
        }
      })
    }, 0)
  }
  reject(reason) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.callbacks.forEach(handler => {
        if (typeof handler[1] === "function") {
          handler[1].call(undefined, reason);
        }
      })
    }, 0)
  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== "function") {
      throw new Error();
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    /* 完善 */
    const handler = [];
    if (typeof succeed === "function") {
      handler[0] = succeed;
    }
    if (typeof fail === "function") {
      handler[1] = fail;
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
