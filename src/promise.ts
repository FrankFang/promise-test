class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    /* 完善 */
    if (this.state !== "pending") {
      return
    }
    this.state = 'fulfilled'
    nextTick(() => {
      this.callbacks.forEach(fns => {
        typeof fns[0] === 'function' && fns[0].call(undefined, result)
      })
    })
  }
  reject(reason) {
    /* 完善 */
    if (this.state !== "pending") {
      return
    }
    this.state = 'rejected'
    nextTick(() => {
      this.callbacks.forEach(fns => {
        typeof fns[1] === 'function' && fns[1].call(undefined, reason)
      })
    })

  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') {
      throw new Error("必须是一个函数")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  then(succeed?, fail?) {
    /* 完善 */
    const tempArr = []
    if (typeof succeed === 'function') {
      tempArr[0] = succeed
    }
    if (typeof fail === 'function') {
      tempArr[1] = fail
    }
    this.callbacks.push(tempArr)
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
