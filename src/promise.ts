class Promise2 {
  state = "pending"
  callbacks = []
  resolve(result) {
    // onFulfilled
    if (this.state === 'fulfilled') return
    this.state = 'fulfilled'
    setTimeout(() => {
      this.callbacks.forEach(temp => {
        if (typeof temp[0] !== 'function') return
        temp[0].call(undefined, result)
      })
    }, 0)
  }
  reject(reason) {
    // onRejected
    if (this.state === 'rejected') return
    this.state = 'rejected'
    setTimeout(() => {
      this.callbacks.forEach(temp => {
        if (typeof temp[1] !== 'function') return
        temp[1].call(undefined, reason)
      })
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('不是一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    let temp = []
    temp[0] = succeed
    temp[1] = fail
    this.callbacks.push(temp)
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
