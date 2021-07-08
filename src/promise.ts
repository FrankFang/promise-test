class Promise2 {
  state = "pending";
  callbacks = [];

  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled'
    nextTick(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[0] === "function") {
          callback[0].call(undefined, result)
        }
      })
    })
  }

  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected'
    nextTick(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[1] === "function") {
          callback[1].call(undefined, reason)
        }
      })
    })
  }

  constructor(fn) {
    if (typeof fn !== "function") {
      throw Error('A function must be passed in as an argument.')
    }
    fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
  }

  then(succeed?, fail?) {
    const callback = []
    if (typeof succeed === "function") {
      callback[0] = succeed
    }
    if (typeof fail === "function") {
      callback[1] = fail
    }
    this.callbacks.push(callback)
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
