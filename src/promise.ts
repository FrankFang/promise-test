class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    /* 完善 */
    if (this.state !== 'pending') return
    this.state = "fulfilled"
    setTimeout(() => {
      this.callbacks.forEach(handle => [
        handle[0] && handle[0].call(undefined,result)
      ])
    }, 0)

  }
  reject(reason) {
    /* 完善 */
    if (this.state !== 'pending') return
    this.state = "rejected"
    setTimeout(() => {
      this.callbacks.forEach(handle => [
        handle[1] && handle[1].call(undefined,reason)
      ])
    }, 0)

  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') throw new Error('promise应该接收一个函数')
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    /* 完善 */
    const handle = []
    if (typeof succeed === 'function') handle[0] = succeed
    if (typeof fail === 'function') handle[1] = fail
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
