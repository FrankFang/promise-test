class Promise2 {
  state = "pending";
  callbacks = [];
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') {
      throw new Error('必须传入一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(result) {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    /* 完善 */
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        const func = handle[0]
        if (typeof func === 'function') {
          func.call(undefined, result)
        }
      })
    })
  }
  reject(reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    /* 完善 */
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        const func = handle[1]
        if (typeof func === 'function') {
          func.call(undefined, reason)
        }
      })
    })
  }
  then(succeed?, fail?) {
    /* 完善 */
    const handle = [null, null]
    if (typeof succeed === 'function') {
      handle[0] = succeed
    }
    if (typeof fail === 'function') {
      handle[1] = fail
    }

    this.callbacks.push(handle)
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
