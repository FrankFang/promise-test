class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== 'pending') return
      //遍历callbacks,调用所以的handle[0]
      this.callbacks.forEach(handle => {
        this.state = 'fulfilled'
        if (typeof handle[0] === 'function') handle[0].call(undefined, result)
      })
    })
  }
  reject(reason) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== 'pending') return
      //遍历callbacks,调用所以的handle[1]
      this.callbacks.forEach(handle => {
        this.state = 'rejected'
        if (typeof handle[1] === 'function') handle[1].call(undefined, reason)
      })
    })
  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') {
      throw new Error('Promise必须接受一个函数')
    }
    fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    /* 完善 */
    let handle = []
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
